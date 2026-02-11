import {useCallback, useEffect, useState} from 'react';
import axios, {AxiosError} from 'axios';
import {BUILDINGS_MOCK, mockDelay} from "@/core/mock/mockData.ts";

export interface Building {
    id: string;
    name: string;
    address: string;
    floors: number;
    roomCount: number;
    buildingAvailable: boolean;
}

const IS_MOCK = true;

export function useBuildingList() {
    const [data, setData] = useState<Building[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBuildings = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            if (IS_MOCK) {
                await mockDelay();
                setData(BUILDINGS_MOCK);
            } else {
                const response = await axios.get<Building[]>('http://localhost:8080/api/buildings');
                setData(response.data);
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                setError(err.message);
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('알 수 없는 에러가 발생했습니다.');
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBuildings()//.then(r => );
    }, [fetchBuildings]);

    const addBuilding = (item: Building) => setData((prev) => [...prev, item]);
    const updateBuilding = (item: Building) => setData((prev) => prev.map((b) => (b.id === item.id ? item : b)));
    const deleteBuilding = (id: string) => setData((prev) => prev.filter((b) => b.id !== id));

    return {
        data,
        isLoading,
        error,
        refetch: fetchBuildings,
        addBuilding,
        updateBuilding,
        deleteBuilding
    };
}