import {useCallback, useEffect, useState} from 'react';
import axios from 'axios';
import type {Resource} from "@/pages/place/uesResourceManagement.ts";

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

export const IS_MOCK = import.meta.env.VITE_IS_MOCK === 'true';
export const API_URL: string = import.meta.env.VITE_API_URL; //`${API_URL}

export function useRoomManagement() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [buildings] = useState<Building[]>([]);
    const [availableResources] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchRooms = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await axios.get<Room[]>(`${API_URL}/api/rooms`);
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