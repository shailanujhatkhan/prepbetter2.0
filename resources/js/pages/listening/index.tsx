import { usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Listening() {
    const { questions } = usePage<{ questions: any[] }>().props;

    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});

    const handleSelect = (questionId: number, optionIndex: number) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionId]: optionIndex,
        }));
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Listening Practice</h1>

            {questions.map((q, i) => (
                <div key={q.id ?? i} className="mb-6 p-4 border rounded-lg">
                    
                    {/* AUDIO PLACEHOLDER (ElevenLabs later) */}
                    <div className="mb-3">
                        <button className="px-3 py-1 bg-blue-600 text-white rounded">
                            ▶ Play Audio
                        </button>
                    </div>

                    {/* QUESTION TEXT */}
                    <p className="font-medium mb-3">{q.title}</p>

                    {/* OPTIONS */}
                    <div className="space-y-2">
                        {(Array.isArray(q.options) ? q.options : JSON.parse(q.options)).map((option: string, index: number) => (
                            <div
                                key={index}
                                onClick={() => handleSelect(q.id ?? i, index)}
                                className={`p-2 border rounded cursor-pointer transition ${
                                    selectedAnswers[q.id ?? i] === index
                                        ? 'bg-blue-100 border-blue-500'
                                        : 'hover:bg-gray-50'
                                }`}
                            >
                                {option}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}