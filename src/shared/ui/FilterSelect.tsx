'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { Filter, ChevronDown, Check } from 'lucide-react';

export interface FilterOption {
    value: string;
    label: string;
}

interface FilterSelectProps {
    value: string;
    onChange: (val: string) => void;
    options: FilterOption[];
    placeholder?: string;
    icon?: ReactNode;
}

export function FilterSelect({
    value,
    onChange,
    options,
    placeholder = 'Оберіть значення',
    icon = <Filter className="w-5 h-5 text-slate-400" />,
}: FilterSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find((opt) => opt.value === value);

    const handleSelect = (newValue: string) => {
        onChange(newValue);
        setIsOpen(false);
    };

    return (
        <div className="relative min-w-[200px]" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between w-full pl-10 pr-4 h-11 border rounded-xl text-sm transition-all outline-none ${
                    isOpen
                        ? 'bg-white border-slate-900 ring-1 ring-slate-900'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
            >
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    {icon}
                </div>

                <span
                    className={`truncate ${!selectedOption ? 'text-slate-500' : 'text-slate-900 font-medium'}`}
                >
                    {selectedOption ? selectedOption.label : placeholder}
                </span>

                <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                    }`}
                />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <ul className="max-h-60 overflow-y-auto py-1 custom-scrollbar">
                        <li
                            onClick={() => handleSelect('')}
                            className={`px-4 py-2.5 text-sm cursor-pointer transition-colors hover:bg-slate-50 ${
                                value === ''
                                    ? 'text-slate-900 font-medium bg-slate-50'
                                    : 'text-slate-600'
                            }`}
                        >
                            {placeholder}
                        </li>

                        {options.map((opt) => {
                            const isSelected = value === opt.value;
                            return (
                                <li
                                    key={opt.value}
                                    onClick={() => handleSelect(opt.value)}
                                    className={`flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer transition-colors hover:bg-slate-50 ${
                                        isSelected
                                            ? 'text-slate-900 font-medium bg-slate-50'
                                            : 'text-slate-600'
                                    }`}
                                >
                                    <span className="truncate">
                                        {opt.label}
                                    </span>
                                    {isSelected && (
                                        <Check className="w-4 h-4 text-slate-900 flex-shrink-0" />
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}
