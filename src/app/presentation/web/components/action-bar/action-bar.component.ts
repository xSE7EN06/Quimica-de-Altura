import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-action-bar',
    standalone: true,
    imports: [CommonModule, MatIconModule],
    templateUrl: './action-bar.component.html',
    styleUrls: ['./action-bar.component.scss']
})
export class ActionBarComponent {
    @Input() searchPlaceholder: string = 'Buscar';
    @Input() addButtonText: string = 'Agregar';
    @Output() search = new EventEmitter<string>();
    @Output() add = new EventEmitter<void>();

    onSearch(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        this.search.emit(value);
    }

    onAdd() {
        this.add.emit();
    }
}
