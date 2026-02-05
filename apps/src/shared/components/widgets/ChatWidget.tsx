'use client';
import { Bot, MessageCircle, Send, User, X } from 'lucide-react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';

type Message = {
    role: 'user' | 'assistant';
    content: string;
};

const TypingIndicator = memo(() => (
    <div className="flex gap-1 items-center">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
    </div>
));

TypingIndicator.displayName = 'TypingIndicator';

export default function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const sendMessage = useCallback(async () => {
        if (!input.trim()) return;

        const newMessages: Message[] = [...messages, { role: 'user', content: input }];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages }),
            });

            const data = await res.json();

            setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
        } catch (err) {
            setMessages([
                ...newMessages,
                {
                    role: 'assistant',
                    content: 'Sorry, something went wrong. Please try again.',
                },
            ]);
        } finally {
            setLoading(false);
        }
    }, [input, loading, messages]);

    const WELCOME_MESSAGE: Message = {
        role: 'assistant',
        content: 'Hello! How can I help you today?',
    };

    return (
        <>
            {!open && (
                <button
                    onClick={() => {
                        setOpen((prev) => {
                            const next = !prev;
                            if (!prev && messages.length === 0) {
                                setMessages([WELCOME_MESSAGE]);
                            }
                            return next;
                        });
                    }}
                    className="fixed bottom-6 right-6 w-16 h-16 bg-linear-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-full text-white shadow-2xl z-50 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
                >
                    <MessageCircle className="w-7 h-7" />
                </button>
            )}

            {open && (
                <div className="fixed bottom-8 right-6 w-95 h-137.5 bg-white rounded-2xl shadow-2xl flex flex-col z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
                    <div className="bg-linear-to-r from-green-500 to-green-600 text-white p-5 rounded-t-2xl flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                <Bot className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="font-semibold text-lg">Online Support</div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                                    <div className="text-xs text-green-100">Online</div>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="hover:bg-white/20 rounded-full p-1.5 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto bg-linear-to-b from-gray-50 to-white">
                        {messages.length === 0 && (
                            <div className="text-center text-gray-500 text-sm mt-8">
                                <Bot className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                <p>We’re ready to assist you!</p>
                            </div>
                        )}
                        <div className="space-y-4">
                            {messages.map((m, i) => (
                                <div
                                    key={i}
                                    className={`flex gap-2 ${
                                        m.role === 'user' ? 'justify-end' : 'justify-start'
                                    } animate-in fade-in slide-in-from-bottom-2 duration-300`}
                                    style={{ animationDelay: `${i * 50}ms` }}
                                >
                                    {m.role === 'assistant' && (
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0 mt-1">
                                            <Bot className="w-5 h-5 text-green-600" />
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                                            m.role === 'user'
                                                ? 'bg-linear-to-br from-green-500 to-green-600 text-white rounded-br-sm'
                                                : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'
                                        }`}
                                    >
                                        {m.content}
                                    </div>
                                    {m.role === 'user' && (
                                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center shrink-0 mt-1">
                                            <User className="w-5 h-5 text-gray-600" />
                                        </div>
                                    )}
                                </div>
                            ))}
                            {loading && (
                                <div className="flex gap-2 justify-start animate-in fade-in duration-300">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                                        <Bot className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
                                        <TypingIndicator />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    <div className="p-4 border-t bg-white rounded-b-2xl">
                        <div className="flex gap-2">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                className="flex-1 border border-gray-300 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                placeholder="Type a message..."
                                disabled={loading}
                            />
                            <button
                                onClick={sendMessage}
                                disabled={loading || !input.trim()}
                                className="bg-linear-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
