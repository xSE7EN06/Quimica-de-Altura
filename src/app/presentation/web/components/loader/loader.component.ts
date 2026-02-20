import { Component, inject, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../../application/services/loading.service';

@Component({
    selector: 'app-loader',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './loader.component.html',
    styleUrl: './loader.component.scss',
})
export class LoaderComponent {
    loadingService = inject(LoadingService);

    mode = input<'fullscreen' | 'inline'>('fullscreen');
    loading = input<boolean | null>(null);

    isActive = computed(() => {
        const loadingInput = this.loading();
        if (loadingInput !== null) {
            return loadingInput;
        }
        return this.loadingService.isLoading();
    });
}
