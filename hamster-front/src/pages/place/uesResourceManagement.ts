import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {mockDelay, RESOURCES_MOCK} from "@/core/mock/mockData.ts";

export const RESOURCE_CATEGORIES = ["디스플레이", "필기도구", "전자기기", "음향장비", "기타"] as const;
export type ResourceCategory = (typeof RESOURCE_CATEGORIES)[number];

export interface Resource {
    id: string;
    name: string;
    category: ResourceCategory;
    description: string;
}

export const IS_MOCK = import.meta.env.VITE_IS_MOCK === 'true';

export function useResourceManagement() {
    const [data, setData] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchResources = useCallback(async () => {
        try {
            setIsLoading(true);
            if (IS_MOCK) {
                await mockDelay();``
                setData(RESOURCES_MOCK);
            } else {
                const response = await axios.get<Resource[]>('/api/resources');
                setData(response.data);
            }
        } catch (err: unknown) {
            setError('리소스 데이터를 불러오지 못했습니다.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchResources(); }, [fetchResources]);

    // Local State CRUD (Sync with Server in real scenario)
    const addResource = (item: Resource) => setData(prev => [...prev, item]);
    const updateResource = (item: Resource) => setData(prev => prev.map(r => r.id === item.id ? item : r));
    const deleteResource = (id: string) => setData(prev => prev.filter(r => r.id !== id));

    return { data, isLoading, error, refetch: fetchResources, addResource, updateResource, deleteResource };
}