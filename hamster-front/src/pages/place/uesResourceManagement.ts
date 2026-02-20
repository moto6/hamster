import {useCallback, useEffect, useState} from 'react';
import {libraryApiClient} from "@/core/http/libraryClient.ts";

export const RESOURCE_CATEGORIES = ["디스플레이", "필기도구", "전자기기", "음향장비", "기타"] as const;
export type ResourceCategory = (typeof RESOURCE_CATEGORIES)[number];

export interface Resource {
    id: string;
    name: string;
    category: ResourceCategory;
    description: string;
}

export function useResourceManagement() {
    const [data, setData] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchResources = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await libraryApiClient.get<Resource[]>(`/api/v0/admin/places/room-resources`);
            setData(response.data);
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