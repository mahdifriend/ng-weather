import {Injectable} from '@angular/core';


@Injectable()
export class CacheService {
    private cacheDuration = 7200; // Default cache duration in seconds (2 hours)

    constructor() {
    }

    // Set the cache duration
    setCacheDuration(seconds: number): void {
        this.cacheDuration = seconds;
    }

    // Save data to cache
    saveToCache(key: string, data: any): void {
        const cacheEntry = {
            timestamp: Date.now(),
            data: data
        };
        localStorage.setItem(key, JSON.stringify(cacheEntry));
    }

    // Retrieve data from cache
    getFromCache(key: string): any {
        const cacheEntry = localStorage.getItem(key);
        if (cacheEntry) {
            const parsedEntry = JSON.parse(cacheEntry);
            const now = Date.now();
            // Check if the cache is still valid
            if (now - parsedEntry.timestamp < this.cacheDuration * 1000) {
                return parsedEntry.data;
            } else {
                localStorage.removeItem(key);
            }
        }
        return null;
    }

    // Remove data from cache
    removeFromCache(key: string): any {
        return localStorage.removeItem(key);
    }
}
