'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface RoleSelectProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

export function RoleSelect({ value, onChange, error }: RoleSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const options = [
        { value: 'PLAYER', label: 'Гравець' },
        { value: 'ORGANIZER', label: 'Організатор' },
    ];

    const selectedLabel =
        options.find((o) => o.value === value)?.label || 'Оберіть роль';

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="space-y-2" ref={dropdownRef}>
            <label className="text-xs font-black uppercase tracking-[0.1em] text-slate-500 pl-1">
                Хто ви?
            </label>

            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex h-14 w-full items-center justify-between rounded-xl border-2 border-slate-900 bg-white px-4 py-2 text-base font-bold text-slate-900 outline-none transition-all hover:bg-slate-50 
                        ${isOpen ? 'ring-2 ring-slate-900 ring-offset-2' : ''}
                        ${error ? 'border-red-500' : ''}
                    `}
                >
                    <span>{selectedLabel}</span>
                    <ChevronDown
                        className={`w-5 h-5 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                </button>

                {isOpen && (
                    <div className="absolute top-full left-0 z-50 w-full mt-2 overflow-hidden rounded-xl border-2 border-slate-900 bg-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] animate-in fade-in slide-in-from-top-2">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`flex w-full items-center justify-between px-4 py-4 text-left text-sm font-bold transition-colors
                                    ${value === option.value ? 'bg-slate-50 text-slate-900' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
                                `}
                            >
                                {option.label}
                                {value === option.value && (
                                    <Check className="w-5 h-5 text-slate-900" />
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {error && (
                <p className="text-xs font-bold text-red-500 pl-1 animate-in slide-in-from-top-1">
                    {error}
                </p>
            )}
        </div>
    );
}
