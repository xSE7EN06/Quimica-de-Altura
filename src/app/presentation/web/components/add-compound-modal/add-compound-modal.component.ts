import { Component, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { IonModal, IonSpinner } from '@ionic/angular/standalone';
import { ChemicalCompound } from '../../../../domain/models/chemical-compound.entity';
import { CompoundRepository } from '../../../../domain/repositories/compound.repository';

@Component({
    selector: 'app-add-compound-modal',
    standalone: true,
    imports: [CommonModule, FormsModule, MatIconModule, IonModal, IonSpinner],
    templateUrl: './add-compound-modal.component.html',
    styleUrls: ['./add-compound-modal.component.scss']
})
export class AddCompoundModalComponent {
    @Output() compoundsAdded = new EventEmitter<ChemicalCompound[]>();

    isOpen = false;
    searchQuery = '';
    isLoading = false;
    searchResults: ChemicalCompound[] = [];
    selectedCompounds: ChemicalCompound[] = [];
    hasSearched = false;

    constructor(private compoundRepository: CompoundRepository, private cdr: ChangeDetectorRef) { }

    open() {
        this.isOpen = true;
        this.reset();
    }

    close() {
        this.isOpen = false;
    }

    private reset() {
        this.searchQuery = '';
        this.isLoading = false;
        this.searchResults = [];
        this.selectedCompounds = [];
        this.hasSearched = false;
    }

    onSearch() {
        if (!this.searchQuery.trim()) return;

        this.isLoading = true;
        this.hasSearched = true;
        this.searchResults = [];
        this.selectedCompounds = [];

        this.compoundRepository.searchCompounds(this.searchQuery).subscribe({
            next: (results) => {
                this.searchResults = results;
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error buscando compuestos:', err);
                this.isLoading = false;
                this.searchResults = [];
                this.cdr.detectChanges();
            }
        });
    }

    onSelect(compound: ChemicalCompound) {
        const index = this.selectedCompounds.findIndex(c => c.pubchemCid === compound.pubchemCid);
        if (index === -1) {
            this.selectedCompounds.push(compound);
        } else {
            this.selectedCompounds.splice(index, 1);
        }
    }

    isSelected(compound: ChemicalCompound): boolean {
        return this.selectedCompounds.some(c => c.pubchemCid === compound.pubchemCid);
    }

    onConfirm() {
        if (this.selectedCompounds.length > 0) {
            this.compoundsAdded.emit(this.selectedCompounds);
            this.close();
        }
    }
}
