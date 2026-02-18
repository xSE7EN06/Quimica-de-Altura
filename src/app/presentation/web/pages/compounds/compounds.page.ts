import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DataTableComponent, ColumnConfig } from '../../components/data-table/data-table.component';
import { AddCompoundModalComponent } from '../../components/add-compound-modal/add-compound-modal.component';
import { CompoundModalComponent } from '../../components/compound-modal/compound-modal.component';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';
import { ChemicalCompound } from '../../../../domain/models/chemical-compound.entity';
import { CompoundRepository } from '../../../../domain/repositories/compound.repository';
import { ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { flask, checkmarkCircle, trash, create, eye } from 'ionicons/icons';

@Component({
    selector: 'app-compounds',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        DataTableComponent,
        AddCompoundModalComponent,
        CompoundModalComponent,
        ConfirmationModalComponent
    ],
    templateUrl: './compounds.page.html',
    styleUrls: ['./compounds.page.scss']
})
export class CompoundsPage implements OnInit {
    compounds: ChemicalCompound[] = [];
    columns: ColumnConfig[] = [];
    tableLoading = true;

    @ViewChild('nameTpl', { static: true }) nameTpl!: TemplateRef<any>;
    @ViewChild('formulaTpl', { static: true }) formulaTpl!: TemplateRef<any>;
    @ViewChild('actionsTpl', { static: true }) actionsTpl!: TemplateRef<any>;

    @ViewChild(AddCompoundModalComponent) addModal!: AddCompoundModalComponent;
    @ViewChild(CompoundModalComponent) compoundModal!: CompoundModalComponent;
    @ViewChild(ConfirmationModalComponent) confirmModal!: ConfirmationModalComponent;

    private selectedId?: string;
    currentIndex = -1;
    selectedCompound?: ChemicalCompound;

    get hasPrevious(): boolean { return this.currentIndex > 0; }
    get hasNext(): boolean { return this.currentIndex < this.compounds.length - 1; }

    constructor(
        private compoundRepository: CompoundRepository,
        private toastController: ToastController,
        private cdr: ChangeDetectorRef
    ) {
        addIcons({ flask, checkmarkCircle, trash, create, eye });
    }

    ngOnInit() {
        this.loadCompounds();
        this.columns = [
            { key: 'name', header: 'Compuesto', cellTemplate: this.nameTpl },
            { key: 'molecularFormula', header: 'Fórmula', cellTemplate: this.formulaTpl },
            { key: 'molecularWeight', header: 'Peso' },
            { key: 'pubchemCid', header: 'PubChem CID' }
        ];
    }

    private loadCompounds() {
        this.tableLoading = true;
        this.compoundRepository.getCompounds().subscribe(data => {
            this.compounds = data;
            setTimeout(() => {
                this.tableLoading = false;
                this.cdr.detectChanges();
            }, 2000);
        });
    }

    onSearch(query: string) {
        if (query) {
            this.compoundRepository.searchCompounds(query).subscribe(data => {
                this.compounds = data;
                this.cdr.detectChanges();
            });
        } else {
            this.loadCompounds();
        }
    }

    onAddCompound() {
        this.addModal.open();
    }

    onCompoundsAdded(compounds: ChemicalCompound[]) {
        let addedCount = 0;
        compounds.forEach(compound => {
            this.compoundRepository.addCompound(compound).subscribe(() => {
                addedCount++;
                if (addedCount === compounds.length) {
                    this.loadCompounds();
                    this.showToast(`${compounds.length} compuestos agregados correctamente`, 'checkmark-circle');
                }
            });
        });
    }

    onViewCompound(compound: ChemicalCompound) {
        this.selectedCompound = compound;
        this.currentIndex = this.compounds.indexOf(compound);
        this.compoundModal.open('view', compound);
    }

    onEditCompound(compound: ChemicalCompound) {
        this.selectedCompound = compound;
        this.currentIndex = this.compounds.indexOf(compound);
        this.compoundModal.open('edit', compound);
    }

    onPrevCompound() {
        if (this.hasPrevious) {
            this.currentIndex--;
            this.selectedCompound = this.compounds[this.currentIndex];
        }
    }

    onNextCompound() {
        if (this.hasNext) {
            this.currentIndex++;
            this.selectedCompound = this.compounds[this.currentIndex];
        }
    }

    onSaveCompound(compound: ChemicalCompound) {
        this.compoundRepository.updateCompound(compound).subscribe(() => {
            this.loadCompounds();
            this.showToast('Compuesto actualizado correctamente', 'checkmark-circle');
        });
    }

    onDeleteCompound(compound: ChemicalCompound) {
        this.selectedId = compound.id;
        this.confirmModal.open();
    }

    onBulkDelete(items: ChemicalCompound[]) {
        if (items.length > 0) {
            this.selectedId = items.map(i => i.id).join(',');
            this.confirmModal.title = `Eliminar ${items.length} Compuestos`;
            this.confirmModal.message = `¿Estás seguro de que deseas eliminar permanentemente los ${items.length} compuestos seleccionados?`;
            this.confirmModal.open();
        }
    }

    onConfirmDelete() {
        if (this.selectedId) {
            const ids = this.selectedId.split(',');
            ids.forEach(id => {
                this.compoundRepository.deleteCompound(id).subscribe(() => {
                    this.loadCompounds();
                });
            });
            this.showToast(`${ids.length} compuesto(s) eliminado(s) correctamente`, 'trash', 'danger');
            this.selectedId = undefined;
        }
    }

    onResetFilters() {
        this.loadCompounds();
    }

    private async showToast(message: string, icon: string, color: string = 'dark') {
        const toast = await this.toastController.create({
            header: 'Módulo de Compuestos',
            message: message,
            duration: 3000,
            position: 'bottom',
            color: color,
            icon: icon,
            buttons: [{ side: 'end', icon: 'close', role: 'cancel' }]
        });
        await toast.present();
    }
}
