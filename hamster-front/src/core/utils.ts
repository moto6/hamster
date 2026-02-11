import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 여러 Tailwind 클래스를 안전하게 병합하는 정석적인 유틸리티 함수입니다.
 * 중복되거나 충돌하는 클래스를 tailwind-merge가 정리해줍니다.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}