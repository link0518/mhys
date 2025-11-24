import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { getHistory, clearHistory, deleteRecord, DivinationRecord } from '@/lib/history';
import { Trash2, History, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '@/components/ui/card';

import ReactMarkdown from 'react-markdown';

interface HistoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function HistoryDialog({ open, onOpenChange }: HistoryDialogProps) {
    const [history, setHistory] = useState<DivinationRecord[]>([]);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        if (open) {
            setHistory(getHistory());
        }
    }, [open]);

    const handleClear = () => {
        if (confirm('确定要清空所有占卜记录吗？')) {
            clearHistory();
            setHistory([]);
        }
    };

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm('确定要删除这条记录吗？')) {
            deleteRecord(id);
            setHistory(prev => prev.filter(record => record.id !== id));
        }
    };

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col bg-stone-50/95 backdrop-blur-sm border-stone-200">
                <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-stone-200">
                    <DialogTitle className="text-2xl font-serif text-stone-800 flex items-center gap-2">
                        <History className="w-6 h-6" />
                        占卜历史
                    </DialogTitle>
                    {history.length > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClear}
                            className="text-stone-500 hover:text-red-600 hover:bg-red-50"
                        >
                            <Trash2 className="w-4 h-4 mr-1" />
                            清空
                        </Button>
                    )}
                </DialogHeader>

                <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-2">
                    {history.length === 0 ? (
                        <div className="text-center text-stone-400 py-12">
                            暂无占卜记录
                        </div>
                    ) : (
                        history.map((record) => (
                            <Card key={record.id} className="bg-white/50 border-stone-200 hover:bg-white/80 transition-colors">
                                <div
                                    className="p-4 cursor-pointer flex items-start justify-between"
                                    onClick={() => toggleExpand(record.id)}
                                >
                                    <div className="space-y-1 flex-1">
                                        <div className="flex items-center gap-2 text-sm text-stone-500">
                                            <span>{formatDate(record.timestamp)}</span>
                                        </div>
                                        <h3 className="font-medium text-stone-800">{record.question || '无问题'}</h3>
                                        <div className="text-sm text-stone-600">
                                            <span className="font-serif text-stone-800">
                                                {record.result.main.upper.name}{record.result.main.lower.name}卦
                                            </span>
                                            {' -> '}
                                            <span className="font-serif text-stone-800">
                                                {record.result.changed.upper.name}{record.result.changed.lower.name}卦
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => handleDelete(e, record.id)}
                                            className="text-stone-400 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0"
                                            title="删除"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            {expandedId === record.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                        </Button>
                                    </div>
                                </div>

                                {expandedId === record.id && (
                                    <div className="px-4 pb-4 border-t border-stone-100 pt-4">
                                        <div className="prose prose-stone max-w-none text-sm">
                                            <h4 className="text-stone-700 font-medium mb-2">解卦结果</h4>
                                            <div className="text-stone-600 leading-relaxed">
                                                <ReactMarkdown>{record.interpretation}</ReactMarkdown>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        ))
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
