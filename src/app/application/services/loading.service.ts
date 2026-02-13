import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    private _loadingCount = 0;
    private _isLoading = signal(false);

    readonly isLoading = this._isLoading.asReadonly();

    show(): void {
        this._loadingCount++;
        this._isLoading.set(true);
    }

    hide(): void {
        if (this._loadingCount > 0) {
            this._loadingCount--;
        }

        if (this._loadingCount === 0) {
            this._isLoading.set(false);
        }
    }
}
