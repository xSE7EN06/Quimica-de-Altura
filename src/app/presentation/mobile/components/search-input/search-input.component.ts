import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { searchOutline, filterOutline, cameraOutline } from 'ionicons/icons';

@Component({
    selector: 'app-search-input',
    standalone: true,
    imports: [CommonModule, IonicModule],
    templateUrl: './search-input.component.html',
    styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent {
    @Output() search = new EventEmitter<string>();
    @Output() filter = new EventEmitter<void>();
    @Output() camera = new EventEmitter<void>();

    constructor() {
        addIcons({ searchOutline, filterOutline, cameraOutline });
    }

    onSearchChange(event: any) {
        this.search.emit(event.detail.value);
    }

    onFilterClick() {
        this.filter.emit();
    }

    onCameraClick() {
        this.camera.emit();
    }
}
