import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
    providedIn: 'root'
})
export class TokenService {
    private readonly ACCESS_TOKEN_KEY = 'access_token';
    private readonly REFRESH_TOKEN_KEY = 'refresh_token';

    constructor(private storageService: StorageService) { }

    saveTokens(accessToken: string, refreshToken: string): void {
        this.storageService.setItem(this.ACCESS_TOKEN_KEY, accessToken);
        this.storageService.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    }

    getAccessToken(): string | null {
        return this.storageService.getItem(this.ACCESS_TOKEN_KEY);
    }

    getRefreshToken(): string | null {
        return this.storageService.getItem(this.REFRESH_TOKEN_KEY);
    }

    removeTokens(): void {
        this.storageService.removeItem(this.ACCESS_TOKEN_KEY);
        this.storageService.removeItem(this.REFRESH_TOKEN_KEY);
    }

    hasAccessToken(): boolean {
        return !!this.getAccessToken();
    }
}
