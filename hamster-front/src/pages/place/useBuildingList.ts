import {useCallback, useEffect, useState} from 'react';
import axios, {AxiosError} from 'axios';

export interface Building {
    id: string;
    name: string;
    address: string;
    floors: number;
    roomCount: number;
    buildingAvailable: boolean;
}

const IS_MOCK = true;

const BUILDING_LIST_MOCK: Building[] = [
    {id: '1', name: '본사 메인타워', address: '서울시 강남구 테헤란로 123', floors: 10, roomCount: 8, buildingAvailable: true},
    {id: '2', name: 'R&D 센터', address: '서울시 강남구 테헤란로 456', floors: 5, roomCount: 4, buildingAvailable: true},
    {id: '3', name: '제2 사옥 (신축)', address: '서울시 서초구 서초대로 789', floors: 12, roomCount: 0, buildingAvailable: true},
];

export function useBuildingList() {
    const [data, setData] = useState<Building[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBuildings = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            if (IS_MOCK) {
                await new Promise((resolve) => setTimeout(resolve, 400));
                setData(BUILDING_LIST_MOCK);
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