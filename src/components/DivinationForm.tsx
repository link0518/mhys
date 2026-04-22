"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Shuffle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DivinationFormProps {
    onComplete: (num1: number, num2: number, num3: number, question: string, movingLine?: number) => void;
}

export default function DivinationForm({ onComplete }: DivinationFormProps) {
    const [question, setQuestion] = useState("");
    const [num1, setNum1] = useState("");
    const [num2, setNum2] = useState("");
    const [num3, setNum3] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const validateAndStart = (n1: number, n2: number, n3: number, movingLine?: number) => {
        if (!question.trim()) {
            setError("请先输入您想问的事情");
            return;
        }
        setError("");
        startDivination(n1, n2, n3, movingLine);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!num1 || !num2 || !num3) return;
        // Manual input doesn't have explicit movingLine, calculates from sum
        validateAndStart(parseInt(num1), parseInt(num2), parseInt(num3));
    };

    const startDivination = (n1: number, n2: number, n3: number, movingLine?: number) => {
        setIsSubmitting(true);
        setTimeout(() => {
            onComplete(n1, n2, n3, question, movingLine);
            setIsSubmitting(false);
        }, 1000);
    };

    const handleRandom = () => {
        if (!question.trim()) {
            setError("请先输入您想问的事情");
            return;
        }
        const r1 = Math.floor(Math.random() * 100) + 1;
        const r2 = Math.floor(Math.random() * 100) + 1;
        const r3 = Math.floor(Math.random() * 100) + 1;
        setNum1(r1.toString());
        setNum2(r2.toString());
        setNum3(r3.toString());
        validateAndStart(r1, r2, r3);
    };

    const handleTime = () => {
        if (!question.trim()) {
            setError("请先输入您想问的事情");
            return;
        }
        import("@/lib/meihua").then(({ generateTimeBasedNumbers }) => {
            const { num1: t1, num2: t2, num3: t3, movingLine } = generateTimeBasedNumbers();
            setNum1(t1.toString());
            setNum2(t2.toString());
            setNum3(t3.toString());
            validateAndStart(t1, t2, t3, movingLine);
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <Card className="w-full max-w-md mx-auto border-stone-200/60 shadow-xl shadow-stone-200/40 bg-white/80 backdrop-blur-md">
                <CardHeader className="text-center space-y-2 pb-8">
                    <CardTitle className="text-3xl text-stone-800">诚心起卦</CardTitle>
                    <CardDescription className="font-ui-cn text-stone-600 text-[15px] tracking-[0.12em]">
                        无事不占 · 不动不占 · 诚心静气
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-2">
                            <Label htmlFor="question" className="font-ui-cn text-stone-700 text-base">
                                所问何事 <span className="text-red-400/80">*</span>
                            </Label>
                            <div className="relative">
                                <textarea
                                    id="question"
                                    value={question}
                                    onChange={(e) => {
                                        setQuestion(e.target.value);
                                        if (error) setError("");
                                    }}
                                    className={cn(
                                        "flex min-h-[100px] w-full rounded-md border border-input bg-white/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                                        "border-stone-200 focus:border-stone-400 focus:ring-stone-200/50 transition-all resize-none font-kai text-lg",
                                        error ? "border-red-300 focus:ring-red-200" : ""
                                    )}
                                    placeholder="心中默念所问之事..."
                                />
                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="text-red-500 text-xs absolute -bottom-6 left-1"
                                    >
                                        {error}
                                    </motion.p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4 pt-2">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="num1" className="font-ui-cn text-stone-700">上卦数</Label>
                                    <Input
                                        id="num1"
                                        type="number"
                                        value={num1}
                                        onChange={(e) => setNum1(e.target.value)}
                                        placeholder="数字"
                                        className="font-mono text-center"
                                        required={!isSubmitting}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="num2" className="font-ui-cn text-stone-700">下卦数</Label>
                                    <Input
                                        id="num2"
                                        type="number"
                                        value={num2}
                                        onChange={(e) => setNum2(e.target.value)}
                                        placeholder="数字"
                                        className="font-mono text-center"
                                        required={!isSubmitting}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="num3" className="font-ui-cn text-stone-700">动爻数</Label>
                                    <Input
                                        id="num3"
                                        type="number"
                                        value={num3}
                                        onChange={(e) => setNum3(e.target.value)}
                                        placeholder="数字"
                                        className="font-mono text-center"
                                        required={!isSubmitting}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-12 text-lg font-song tracking-widest bg-stone-800 hover:bg-stone-700 text-stone-50 shadow-lg hover:shadow-stone-800/20 transition-all duration-500"
                            >
                                {isSubmitting ? (
                                    <span className="animate-pulse">推演中...</span>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        开始起卦
                                    </>
                                )}
                            </Button>

                            <div className="grid grid-cols-2 gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleRandom}
                                    disabled={isSubmitting}
                                    className="h-10 border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                                >
                                    <Shuffle className="w-3 h-3 mr-2" />
                                    随机起卦
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleTime}
                                    disabled={isSubmitting}
                                    className="h-10 border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                                >
                                    <Clock className="w-3 h-3 mr-2" />
                                    时间起卦
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    );
}

