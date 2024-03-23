import { Injectable } from '@angular/core';

@Injectable()
export class CacheService {
    private cacheDuration = 7200; // Default cache duration in seconds (2 hours)

    constructor() {}

    // Set the cache duration
    setCacheDuration(seconds: number): void {
        this.cacheDuration = seconds;
    }

    // Save data to cache with a generic type
    saveToCache<T>(key: string, data: T): void {
        const cacheEntry = {
            timestamp: Date.now(),
            data: data
        };
        localStorage.setItem(key, JSON.stringify(cacheEntry));
    }

    // Retrieve data from cache with a generic type
    getFromCache<T>(key: string): T | null {
        const cacheEntry = localStorage.getItem(key);
        if (cacheEntry) {
            const parsedEntry = JSON.parse(cacheEntry);
            const now = Date.now();
            // Check if the cache is still valid
            if (now - parsedEntry.timestamp < this.cacheDuration * 1000) {
                return parsedEntry.data as T;
            } else {
                localStorage.removeItem(key);
            }
        }
        return null;
    }

    // Remove data from cache
    removeFromCache(key: string): void {
        localStorage.removeItem(key);
    }
}
