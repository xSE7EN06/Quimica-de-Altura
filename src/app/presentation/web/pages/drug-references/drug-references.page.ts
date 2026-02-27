import { Component, ViewChild, TemplateRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { DataTableComponent, ColumnConfig } from '../../components/data-table/data-table.component';
import { DrugReferenceModalComponent } from '../../components/drug-reference-modal/drug-reference-modal.component';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';
import { DrugReference } from '../../../../domain/models/drug-reference.entity';
import { DrugReferenceRepository } from '../../../../domain/repositories/drug-reference.repository';
import { ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircle, trash, alertCircle } from 'ionicons/icons';

@Component({
  selector: 'app-drug-references',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule, DataTableComponent, DrugReferenceModalComponent, ConfirmationModalComponent],
  templateUrl: './drug-references.page.html',
  styleUrls: ['./drug-references.page.scss']
})
export class DrugReferencesPage implements OnInit {
  items: DrugReference[] = [];
  private originalItems: DrugReference[] = [];
  columns: ColumnConfig[] = [];
  activeFilters: Record<string, string[]> = { linkedPlant: [] };
  selectedPlant = '';
  searchTerm = '';
  tableLoading = true;

  @ViewChild('scoreTpl', { static: true }) scoreTpl!: TemplateRef<any>;
  @ViewChild(DataTableComponent) dataTable!: DataTableComponent;
  @ViewChild(DrugReferenceModalComponent) itemModal!: DrugReferenceModalComponent;
  @ViewChild(ConfirmationModalComponent) confirmModal!: ConfirmationModalComponent;

  private selectedItemId?: string;
  currentIndex = -1;
  selectedItem?: DrugReference;

  get hasPrevious(): boolean { return this.currentIndex > 0; }
  get hasNext(): boolean { return this.currentIndex < this.items.length - 1; }

  constructor(
    private repo: DrugReferenceRepository,
    private toastController: ToastController,
    private cdr: ChangeDetectorRef
  ) { addIcons({ checkmarkCircle, trash, alertCircle }); }

  ngOnInit() {
    this.loadData();
    this.columns = [
      { key: 'drugName', header: 'Fármaco' },
      { key: 'activeIngredient', header: 'Ingrediente Activo' },
      { key: 'linkedPlant', header: 'Planta Relacionada' },
      { key: 'similarityScore', header: 'Similitud', cellTemplate: this.scoreTpl },
      { key: 'mechanism', header: 'Mecanismo' }
    ];
  }

  private loadData() {
    this.tableLoading = true;
    this.repo.getAll().subscribe(data => {
      this.originalItems = data;
      this.applyFilters();
      setTimeout(() => { this.tableLoading = false; this.cdr.detectChanges(); }, 2000);
    });
  }

  private applyFilters() {
    let filtered = [...this.originalItems];
    if (this.activeFilters['linkedPlant']?.length > 0) {
      filtered = filtered.filter(i => this.activeFilters['linkedPlant'].some(p => i.linkedPlant.includes(p)));
    }
    this.items = filtered;
  }

  onAddItem() { this.itemModal.open('add'); }
  onViewItem(item: DrugReference) { this.selectedItem = item; this.currentIndex = this.items.indexOf(item); this.itemModal.open('view', item); }
  onEditItem(item: DrugReference) { this.selectedItem = item; this.currentIndex = this.items.indexOf(item); this.itemModal.open('edit', item); }
  onPrevItem() { if (this.hasPrevious) { this.currentIndex--; this.selectedItem = this.items[this.currentIndex]; } }
  onNextItem() { if (this.hasNext) { this.currentIndex++; this.selectedItem = this.items[this.currentIndex]; } }
  onDeleteItem(item: DrugReference) { this.selectedItemId = item.id; this.confirmModal.open(); }

  onBulkDelete(items: DrugReference[]) {
    this.confirmModal.title = `Eliminar ${items.length} referencias`;
    this.confirmModal.message = `¿Eliminar las ${items.length} referencias seleccionadas?`;
    this.selectedItemId = items.map(i => i.id).join(',');
    this.confirmModal.open();
  }

  onConfirmDelete() {
    if (this.selectedItemId) {
      const ids = this.selectedItemId.split(',');
      ids.forEach(id => this.repo.delete(id).subscribe(() => this.loadData()));
      this.showToast(`${ids.length} referencia(s) eliminada(s)`, 'trash', 'danger');
      this.selectedItemId = undefined;
    }
    this.loadData();
  }

  onSaveItem(item: DrugReference) {
    if (item.id) {
      this.repo.update(item).subscribe(() => { this.loadData(); this.showToast('Referencia actualizada', 'checkmark-circle'); });
    } else {
      this.repo.add(item).subscribe(() => { this.loadData(); this.showToast('Referencia agregada', 'checkmark-circle'); });
    }
  }

  onFilterChange(type: string, value: string) {
    if (value && !this.activeFilters[type]?.includes(value)) {
      this.activeFilters[type].push(value); this.applyFilters(); this.cdr.detectChanges();
    }
  }

  removeFilter(type: string, value: string) {
    const idx = this.activeFilters[type]?.indexOf(value);
    if (idx > -1) { this.activeFilters[type].splice(idx, 1); this.applyFilters(); }
  }

  onResetFilters() { this.activeFilters = { linkedPlant: [] }; this.applyFilters(); }

  getPlants(): string[] { return [...new Set(this.originalItems.map(i => i.linkedPlant))]; }

  getScoreColor(score: number): string {
    if (score >= 0.8) return '#2ecc71';
    if (score >= 0.6) return '#f1c40f';
    return '#e74c3c';
  }

  private async showToast(message: string, icon: string, color: string = 'dark') {
    const toast = await this.toastController.create({
      header: '¡Éxito!', message, duration: 3000, position: 'bottom', color, icon,
      cssClass: 'custom-success-toast', buttons: [{ side: 'end', icon: 'close', role: 'cancel' }]
    });
    await toast.present();
  }
}
