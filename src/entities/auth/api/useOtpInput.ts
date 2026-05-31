'use client';

import { useState, useRef, KeyboardEvent, ClipboardEvent } from 'react';

export function useOtpInput(length: number = 6) {
    const [code, setCode] = useState<string[]>(Array(length).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value.slice(-1);
        setCode(newCode);

        if (value && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (
        index: number,
        e: KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData
            .getData('text')
            .replace(/\D/g, '')
            .slice(0, length);

        if (pastedData) {
            const newCode = [...code];
            for (let i = 0; i < pastedData.length; i++) {
                newCode[i] = pastedData[i];
            }
            setCode(newCode);

            const focusIndex = Math.min(pastedData.length, length - 1);
            inputRefs.current[focusIndex]?.focus();
        }
    };

    const fullCode = code.join('');
    const isComplete = fullCode.length === length;

    return {
        code,
        inputRefs,
        handleChange,
        handleKeyDown,
        handlePaste,
        fullCode,
        isComplete,
    };
}
