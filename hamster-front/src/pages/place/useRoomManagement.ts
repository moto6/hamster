import {useCallback, useEffect, useState} from 'react';
import type {Resource} from "@/pages/place/uesResourceManagement.ts";
import {libraryApiClient} from "@/core/http/libraryClient.ts";

export interface Building {
    id: string;
    name: string;
}

export interface Room {
    roomId: string;
    buildingId: string;
    buildingName: string;
    roomName: string;
    roomFloor: string;
    roomFloorMap: string;
    roomLocationNote: string;
    capacity: number;
    resourceIds: string[]; // Resource IDs
    roomAvailable: boolean;
}

export function useRoomManagement() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [buildings] = useState<Building[]>([]);
    const [availableResources] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchRooms = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await libraryApiClient.get<Room[]>(`/api/v0/admin/places/rooms`);
            setRooms(response.data);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);

    const addRoom = (item: Room) => setRooms(prev => [...prev, item]);
    const updateRoom = (item: Room) => setRooms(prev => prev.map(r => r.roomId === item.roomId ? item : r));
    const deleteRoom = (id: string) => setRooms(prev => prev.filter(r => r.roomId !== id));

    return {rooms, buildings, availableResources, isLoading, addRoom, updateRoom, deleteRoom};
}