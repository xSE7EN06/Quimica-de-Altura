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

    @ViewChild('nameTpl', { static: true }) nameTpl!: TemplateRef<any>;
    @ViewChild('formulaTpl', { static: true }) formulaTpl!: TemplateRef<any>;
    @ViewChild('actionsTpl', { static: true }) actionsTpl!: TemplateRef<any>;

    @ViewChild(AddCompoundModalComponent) addModal!: AddCompoundModalComponent;
    @ViewChild(CompoundModalComponent) compoundModal!: CompoundModalComponent;
    @ViewChild(ConfirmationModalComponent) confirmModal!: ConfirmationModalComponent;

    private selectedId?: string;

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
            { key: 'pubchemCid', header: 'PubChem CID' },
            { key: 'actions', header: 'Acciones', cellTemplate: this.actionsTpl }
        ];
    }

    private loadCompounds() {
        this.compoundRepository.getCompounds().subscribe(data => {
            this.compounds = data;
            this.cdr.detectChanges();
        });
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
        this.compoundModal.open('view', compound);
    }

    onEditCompound(compound: ChemicalCompound) {
        this.compoundModal.open('edit', compound);
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

    onConfirmDelete() {
        if (this.selectedId) {
            this.compoundRepository.deleteCompound(this.selectedId).subscribe(() => {
                this.loadCompounds();
                this.showToast('Compuesto eliminado correctamente', 'trash', 'danger');
                this.selectedId = undefined;
            });
        }
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
