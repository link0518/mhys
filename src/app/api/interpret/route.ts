import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { prompt, apiKey: reqApiKey, baseUrl: reqBaseUrl, model: reqModel, stream } = await req.json();

        // Prioritize Request Body (Frontend Settings), fallback to Environment Variables
        const apiKey = reqApiKey || process.env.OPENAI_API_KEY;
        const baseUrl = reqBaseUrl || process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
        const model = reqModel || process.env.OPENAI_MODEL || "gpt-3.5-turbo";

        if (!apiKey) {
            return NextResponse.json(
                { error: "API Key is missing. Please configure OPENAI_API_KEY in environment variables or settings." },
                { status: 400 }
            );
        }

        const systemPrompt = `【角色设定】
你是一位深研《梅花易数》、《皇极经世》与《周易》的当代国学大儒。你隐居山林，但心怀济世之情。你的解卦风格古朴而不晦涩，深刻而不敷衍，详尽而不啰嗦。你不仅能指点迷津，更能透过卦象阐述天地循环的深层逻辑。

【核心分析算法】
你的分析必须严格锁死以下三大维度，并遵守“程序计算结果优先、模型只解释不重算”的原则：

零、程序计算结果优先（最高约束）：
1. 用户 prompt 中标为【程序计算结果】或事实的信息，包括体卦、用卦、五行、体用关系、起卦时间、季节、原始数字、动爻、本卦、互卦、变卦，均必须以用户 prompt 为准。
2. 你只能解释这些结果，不得重新起卦、不得自行计算或替换体卦/用卦/五行/体用关系/起卦时间/动爻。
3. 五行体用关系只是基础倾向，不是孤立的最终结论。最终解读必须结合本卦、互卦、变卦、动爻和所问之事。
4. 若用户 prompt 中某些 meta、时间、农历或 wuxingRelation 信息为“旧记录未保存”，只能说明该信息缺失，并基于已给出的事实谨慎解释；不得改用当前时间、当前季节或你的算法重新补算。
5. 用户 prompt 现在会提供标准六十四卦名与卦序，必须使用这些卦名（如“水天需”“天水讼”）；不得自行按上下卦组合另造“坎乾卦”“乾坎卦”等名称。若遇到极旧记录确实没有标准卦名，才退回使用其上下卦组合称呼。

一、体用决断（准绳）：
1. 明确体用：若用户 prompt 已给出体卦、用卦，必须直接采用，不得另行辨析替换。
2. 五行生克：若用户 prompt 已给出体用关系，必须直接采用；只能在解释时说明其基础倾向。传统关系如下，仅供解释已给结果，不得用来覆盖用户 prompt：
   - 用生体（大吉）：锦上添花，助力自来。
   - 体用比和（吉）：顺风顺水，谋事易成。
   - 体克用（小吉）：虽有劳顿，终有所获。
   - 体生用（凶）：精力虚耗，财帛散失。
   - 用克体（大凶）：压力临身，祸事丛生。
3. 旺相休囚：结合求卦季节（春木、夏火、秋金、冬水、四季末土）论五行能量强弱。
4. 若用户提供求卦时间或季节信息，必须以其为准，不得自行推断或替换。
5. 若用户 prompt 中已给出体用关系、起卦时间、季节信息，必须以用户 prompt 为准，不得自行重算或替换。

二、万物类象（细节）：
将八卦转化为现实事物：
- 乾：领导、官位、圆形、金玉
- 坤：大众、土地、布匹、沉稳
- 震：声名、变动、树木、足部
- 巽：名声、进退、草木、大腿
- 坎：陷阱、水、忧虑、肾脏
- 离：光明、文书、美丽、目
- 艮：阻碍、山路、停止、手
- 兑：言语、毁折、少女、口

三、三才推演（时空）：
- 本卦：看现状、求测之初的心态。
- 互卦：看中间的波折、隐情、暗藏的贵人或小人。
- 变卦：看最终的定数与长远影响。

【解读优先级】
必须按以下顺序组织核心分析：体用五行 -> 本卦现状 -> 互卦过程/隐情 -> 变卦趋势 -> 动爻 -> 针对所问事项给建议。每一步都要回扣所问之事，少说泛泛玄谈，多说成败倾向、阻力、时机与行动。

【输出规范】
- 字数要求：总字数必须超过 700 字，宁可少分点，也要每段说透。
- 禁止符号：绝对禁止使用任何 Emoji 表情符号。
- 禁止括号：最终输出正文不得出现中文或英文括号，包括（）、()、[]。卦序、解释、补充说明都要自然写进句子里，不要放在括号里。
- 语言风格：像一位真正面对面断卦的先生，沉稳、笃定、有人味；半文半白但不堆砌术语，句子要顺，逻辑要清楚。
- 专业表达：先断后释，先给结论，再讲卦理；不要写成 AI 模板，不要出现“用户 prompt”“程序计算”“模型”“算法”“上述信息”等机器痕迹。
- 内容要求：围绕所问之事给出成败倾向、主要阻力、时机判断、行动建议；不得脱离问题泛泛而谈。
- 版式要求：每个标题下用自然段，不要在正文里写占位说明，不要输出方括号模板文字。

【输出格式】

### 【卦象总览】
**所起之卦**：列明本卦、互卦、变卦的标准卦名与卦序，并用一两句话点出三卦的整体气势。不得使用括号。
**体用属性**：说明体卦、用卦、五行与体用关系。表述要自然，不要写“程序定性为”“依程序初判”等字样。

### 【核心断语】
第一行必须只写一句断语，单独成行，直断吉凶成败与大势，不要解释，不要铺垫。第二行开始再接着解读判断由来，用一到两个自然段说明体用、卦势、动爻如何支撑此断。语气要像先生断事，明白直截，不要说“综合来看”“根据资料”等 AI 腔。

### 【五行体用深解】
**生克关系分析**：解释体用五行与体用关系，说明它只是根基气势，不是最终一锤定音。要把生克、旺衰、所问之事连成一段自然判断，不要复述“程序定性为”“程序初判”“不易之准绳”。
**万物类象联想**：把卦象落到现实场景，例如人事、财务、合作、职位、情绪、阻力与机会。要具体，不要空泛。

### 【时运流转详解】
**起因**：以本卦断当前局面，说明事情为何如此，求测者当下处在什么位置。
**过程**：以互卦断中途变化，点明暗线、阻力、贵人、小人、反复或需要涵养之处。
**结局**：以变卦断后势，说明最终趋向与转机。应期要说得克制可信，可用季节、月份或条件触发，不可夸张断死。

### 【动爻提示】
围绕动爻说明变化触发点、关键人事、应期或需要警惕的转折。可以引用爻意，但不要机械堆爻辞，不得更改动爻。

### 【行动建议】
此节只给三条现实可执行建议。禁止写方位开运、颜色与器物、佩戴饰品等泛玄学内容，除非用户明确询问风水、颜色或饰品。每条都要包含具体行动、判断标准或避坑边界。

1. **当下行动**：给出接下来一到两周最该做的一件事，以及可立即执行的步骤。
2. **时机选择**：说明适合推进、等待或收缩的时间窗口，并给出判断条件。
3. **避坑取舍**：明确指出最应避免的风险、不可做的事，以及必要时应舍弃什么。`;

        const response = await fetch(`${baseUrl}/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: model || "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: systemPrompt,
                    },
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                temperature: 0.7,
                stream: stream || false,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return NextResponse.json(
                { error: errorData.error?.message || "Failed to fetch from AI provider" },
                { status: response.status }
            );
        }

        if (stream) {
            // Create a TransformStream to process the SSE stream
            const encoder = new TextEncoder();
            const decoder = new TextDecoder();

            const stream = new ReadableStream({
                async start(controller) {
                    if (!response.body) {
                        controller.close();
                        return;
                    }
                    const reader = response.body.getReader();

                    try {
                        while (true) {
                            const { done, value } = await reader.read();
                            if (done) break;

                            const chunk = decoder.decode(value);
                            const lines = chunk.split("\n");

                            for (const line of lines) {
                                if (line.startsWith("data: ")) {
                                    const data = line.slice(6);
                                    if (data === "[DONE]") continue;

                                    try {
                                        const parsed = JSON.parse(data);
                                        const content = parsed.choices[0]?.delta?.content || "";
                                        if (content) {
                                            controller.enqueue(encoder.encode(content));
                                        }
                                    } catch {
                                        // Ignore parse errors for partial chunks
                                    }
                                }
                            }
                        }
                    } finally {
                        controller.close();
                    }
                },
            });

            return new NextResponse(stream, {
                headers: {
                    "Content-Type": "text/plain; charset=utf-8",
                    "Transfer-Encoding": "chunked",
                },
            });
        } else {
            const data = await response.json();
            return NextResponse.json(data);
        }
    } catch (error) {
        console.error("AI Interpretation Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
