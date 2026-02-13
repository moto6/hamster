import { useState, useCallback } from 'react';

// Playground는 순수 UI 검증용이므로 간단한 상태만 관리합니다.
export function usePlayground1() {
    const [inputValue, setInputValue] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const simulateLoading = useCallback(() => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 2000);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    return {
        inputValue,
        isLoading,
        handleInputChange,
        simulateLoading,
    };
}