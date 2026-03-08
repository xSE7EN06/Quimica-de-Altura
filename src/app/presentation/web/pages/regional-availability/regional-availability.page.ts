import { Component, ViewChild, TemplateRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { DataTableComponent, ColumnConfig } from '../../components/data-table/data-table.component';
import { RegionalAvailabilityModalComponent } from '../../components/regional-availability-modal/regional-availability-modal.component';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';
import { RegionalAvailability } from '../../../../domain/models/regional-availability.entity';
import { RegionalAvailabilityRepository } from '../../../../domain/repositories/regional-availability.repository';
import { ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircle, trash, alertCircle } from 'ionicons/icons';

@Component({
  selector: 'app-regional-availability',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule, DataTableComponent, RegionalAvailabilityModalComponent, ConfirmationModalComponent],
  templateUrl: './regional-availability.page.html',
  styleUrls: ['./regional-availability.page.scss']
})
export class RegionalAvailabilityPage implements OnInit {
  items: RegionalAvailability[] = [];
  private originalItems: RegionalAvailability[] = [];
  columns: ColumnConfig[] = [];
  activeFilters: Record<string, string[]> = { state: [], abundance: [] };
  selectedState = '';
  selectedAbundance = '';
  searchTerm = '';
  tableLoading = true;

  @ViewChild('abundanceTpl', { static: true }) abundanceTpl!: TemplateRef<any>;
  @ViewChild(DataTableComponent) dataTable!: DataTableComponent;
  @ViewChild(RegionalAvailabilityModalComponent) itemModal!: RegionalAvailabilityModalComponent;
  @ViewChild(ConfirmationModalComponent) confirmModal!: ConfirmationModalComponent;

  private selectedItemId?: string;
  currentIndex = -1;
  selectedItem?: RegionalAvailability;

  get hasPrevious(): boolean { return this.currentIndex > 0; }
  get hasNext(): boolean { return this.currentIndex < this.items.length - 1; }

  constructor(
    private repo: RegionalAvailabilityRepository,
    private toastController: ToastController,
    private cdr: ChangeDetectorRef
  ) { addIcons({ checkmarkCircle, trash, alertCircle }); }

  ngOnInit() {
    this.loadData();
    this.columns = [
      { key: 'species', header: 'Especie' },
      { key: 'state', header: 'Estado' },
      { key: 'region', header: 'Región' },
      { key: 'abundance', header: 'Abundancia', cellTemplate: this.abundanceTpl },
      { key: 'lastUpdated', header: 'Actualizado' }
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
    if (this.activeFilters['state']?.length > 0) filtered = filtered.filter(i => this.activeFilters['state'].includes(i.state));
    if (this.activeFilters['abundance']?.length > 0) filtered = filtered.filter(i => this.activeFilters['abundance'].includes(i.abundance));
    this.items = filtered;
  }

  onAddItem() { this.itemModal.open('add'); }
  onViewItem(item: RegionalAvailability) { this.selectedItem = item; this.currentIndex = this.items.indexOf(item); this.itemModal.open('view', item); }
  onEditItem(item: RegionalAvailability) { this.selectedItem = item; this.currentIndex = this.items.indexOf(item); this.itemModal.open('edit', item); }
  onPrevItem() { if (this.hasPrevious) { this.currentIndex--; this.selectedItem = this.items[this.currentIndex]; this.itemModal.open('view', this.selectedItem); } }
  onNextItem() { if (this.hasNext) { this.currentIndex++; this.selectedItem = this.items[this.currentIndex]; this.itemModal.open('view', this.selectedItem); } }
  onDeleteItem(item: RegionalAvailability) { this.selectedItemId = item.id; this.confirmModal.open(); }

  onBulkDelete(items: RegionalAvailability[]) {
    this.confirmModal.title = `Eliminar ${items.length} registros`;
    this.confirmModal.message = `¿Eliminar los ${items.length} registros seleccionados?`;
    this.selectedItemId = items.map(i => i.id).join(',');
    this.confirmModal.open();
  }

  onConfirmDelete() {
    if (this.selectedItemId) {
      const ids = this.selectedItemId.split(',');
      ids.forEach(id => this.repo.delete(id).subscribe(() => this.loadData()));
      this.showToast(`${ids.length} registro(s) eliminado(s)`, 'trash', 'danger');
      this.selectedItemId = undefined;
    }
    this.loadData();
  }

  onSaveItem(item: RegionalAvailability) {
    if (item.id) {
      this.repo.update(item).subscribe(() => { this.loadData(); this.showToast('Registro actualizado', 'checkmark-circle'); });
    } else {
      this.repo.add(item).subscribe(() => { this.loadData(); this.showToast('Registro agregado', 'checkmark-circle'); });
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

  onResetFilters() { this.activeFilters = { state: [], abundance: [] }; this.applyFilters(); }

  getStates(): string[] { return [...new Set(this.originalItems.map(i => i.state))]; }

  getAbundanceLabel(value: string): string {
    const map: Record<string, string> = { common: 'Común', scarce: 'Escasa', rare: 'Rara' };
    return map[value] || value;
  }

  private async showToast(message: string, icon: string, color: string = 'dark') {
    const toast = await this.toastController.create({
      header: '¡Éxito!', message, duration: 3000, position: 'bottom', color, icon,
      cssClass: 'custom-success-toast', buttons: [{ side: 'end', icon: 'close', role: 'cancel' }]
    });
    await toast.present();
  }
}
