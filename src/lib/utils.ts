import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Format purr count for display
 * @param count - The purr count
 * @returns Formatted string (e.g., "847", "64k", "2.1M")
 */
export function formatPurrCount(count: number): string {
    if (count < 1000) {
        return count.toString();
    } else if (count < 1000000) {
        return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`;
    } else {
        return `${(count / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
    }
}
