import React from 'react';

export default function Footer() {
    return (
        <footer className="w-full py-6 mt-auto text-center">
            <div className="flex flex-col items-center gap-2">
                <div className="h-[1px] w-12 bg-stone-200" />
                <p className="font-ui-cn text-stone-500 text-sm tracking-[0.08em]">
                    © 2025 梅花易数 · 观象授时
                </p>
            </div>
        </footer>
    );
}
