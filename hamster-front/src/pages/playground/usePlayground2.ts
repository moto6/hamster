import { useState, useCallback } from 'react';

export function usePlayground2() {
    // Select 상태
    const [buildingStatus, setBuildingStatus] = useState<string>('');

    // RadioGroup 상태
    const [themeMode, setThemeMode] = useState<string>('light');

    // 로딩 시뮬레이션 상태
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const handleSave = useCallback(() => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert('설정이 저장되었습니다.');
        }, 1500);
    }, []);

    return {
        buildingStatus,
        setBuildingStatus,
        themeMode,
        setThemeMode,
        isSaving,
        handleSave,
    };
}