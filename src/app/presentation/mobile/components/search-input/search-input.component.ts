import { Component, EventEmitter, Output, Input } from '@angular/core';
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
    @Input() placeholder: string = 'Buscar plantas por síntomas, nombre o uso...';
    @Input() showCamera: boolean = true;
    @Input() showFilter: boolean = true;

    @Output() search = new EventEmitter<string>();
    @Output() filter = new EventEmitter<void>();
    @Output() camera = new EventEmitter<void>();

    constructor() {
        addIcons({ searchOutline, filterOutline, cameraOutline });
    }

    onSearchChange(event: any) {
        this.search.emit(event.target.value);
    }

    onFilterClick() {
        this.filter.emit();
    }

    onCameraClick() {
        this.camera.emit();
    }
}
