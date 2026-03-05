import { Component, ViewChild, TemplateRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { DataTableComponent, ColumnConfig } from '../../components/data-table/data-table.component';
import { ModerationModalComponent } from '../../components/moderation-modal/moderation-modal.component';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';
import { ModerationItem } from '../../../../domain/models/moderation-item.entity';
import { ModerationItemRepository } from '../../../../domain/repositories/moderation-item.repository';
import { ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircle, trash, alertCircle } from 'ionicons/icons';

@Component({
  selector: 'app-moderation',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule, DataTableComponent, ModerationModalComponent, ConfirmationModalComponent],
  templateUrl: './moderation.page.html',
  styleUrls: ['./moderation.page.scss']
})
export class ModerationPage implements OnInit {
  items: ModerationItem[] = [];
  private originalItems: ModerationItem[] = [];
  columns: ColumnConfig[] = [];
  activeFilters: Record<string, string[]> = { status: [], type: [] };
  selectedStatus = '';
  selectedType = '';
  searchTerm = '';
  tableLoading = true;

  @ViewChild('typeTpl', { static: true }) typeTpl!: TemplateRef<any>;
  @ViewChild('contentTpl', { static: true }) contentTpl!: TemplateRef<any>;
  @ViewChild('statusTpl', { static: true }) statusTpl!: TemplateRef<any>;
  @ViewChild(DataTableComponent) dataTable!: DataTableComponent;
  @ViewChild(ModerationModalComponent) itemModal!: ModerationModalComponent;
  @ViewChild(ConfirmationModalComponent) confirmModal!: ConfirmationModalComponent;

  private selectedItemId?: string;
  currentIndex = -1;
  selectedItem?: ModerationItem;

  get hasPrevious(): boolean { return this.currentIndex > 0; }
  get hasNext(): boolean { return this.currentIndex < this.items.length - 1; }

  constructor(
    private repo: ModerationItemRepository,
    private toastController: ToastController,
    private cdr: ChangeDetectorRef
  ) { addIcons({ checkmarkCircle, trash, alertCircle }); }

  ngOnInit() {
    this.loadData();
    this.columns = [
      { key: 'type', header: 'Tipo', cellTemplate: this.typeTpl },
      { key: 'content', header: 'Contenido', cellTemplate: this.contentTpl },
      { key: 'submittedBy', header: 'Enviado por' },
      { key: 'submittedAt', header: 'Fecha' },
      { key: 'status', header: 'Estado', cellTemplate: this.statusTpl }
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
    if (this.activeFilters['status']?.length > 0) filtered = filtered.filter(i => this.activeFilters['status'].includes(i.status));
    if (this.activeFilters['type']?.length > 0) filtered = filtered.filter(i => this.activeFilters['type'].includes(i.type));
    this.items = filtered;
  }

  onAddItem() { this.itemModal.open('add'); }
  onViewItem(item: ModerationItem) { this.selectedItem = item; this.currentIndex = this.items.indexOf(item); this.itemModal.open('view', item); }
  onEditItem(item: ModerationItem) { this.selectedItem = item; this.currentIndex = this.items.indexOf(item); this.itemModal.open('edit', item); }
  onPrevItem() { if (this.hasPrevious) { this.currentIndex--; this.selectedItem = this.items[this.currentIndex]; } }
  onNextItem() { if (this.hasNext) { this.currentIndex++; this.selectedItem = this.items[this.currentIndex]; } }
  onDeleteItem(item: ModerationItem) { this.selectedItemId = item.id; this.confirmModal.open(); }

  onBulkDelete(items: ModerationItem[]) {
    this.confirmModal.title = `Eliminar ${items.length} elementos`;
    this.confirmModal.message = `¿Eliminar los ${items.length} elementos de moderación seleccionados?`;
    this.selectedItemId = items.map(i => i.id).join(',');
    this.confirmModal.open();
  }

  onConfirmDelete() {
    if (this.selectedItemId) {
      const ids = this.selectedItemId.split(',');
      ids.forEach(id => this.repo.delete(id).subscribe(() => this.loadData()));
      this.showToast(`${ids.length} elemento(s) eliminado(s)`, 'trash', 'danger');
      this.selectedItemId = undefined;
    }
    this.loadData();
  }

  onSaveItem(item: ModerationItem) {
    if (item.id) {
      this.repo.update(item).subscribe(() => { this.loadData(); this.showToast('Elemento actualizado', 'checkmark-circle'); });
    } else {
      this.repo.add(item).subscribe(() => { this.loadData(); this.showToast('Elemento agregado', 'checkmark-circle'); });
    }
  }

  onFilterChange(key: string, value: string) {
    if (value && !this.activeFilters[key]?.includes(value)) {
      this.activeFilters[key].push(value); this.applyFilters(); this.cdr.detectChanges();
    }
  }

  removeFilter(key: string, value: string) {
    const idx = this.activeFilters[key]?.indexOf(value);
    if (idx > -1) { this.activeFilters[key].splice(idx, 1); this.applyFilters(); }
  }

  onResetFilters() { this.activeFilters = { status: [], type: [] }; this.applyFilters(); }

  getTypeLabel(v: string): string { const m: Record<string, string> = { record: 'Registro', correction: 'Corrección', submission: 'Envío' }; return m[v] || v; }
  getStatusLabel(v: string): string { const m: Record<string, string> = { pending: 'Pendiente', approved: 'Aprobado', rejected: 'Rechazado' }; return m[v] || v; }
  truncate(s: string, n = 70): string { return s?.length > n ? s.substring(0, n) + '…' : s; }

  private async showToast(message: string, icon: string, color: string = 'dark') {
    const toast = await this.toastController.create({
      header: '¡Éxito!', message, duration: 3000, position: 'bottom', color, icon,
      cssClass: 'custom-success-toast', buttons: [{ side: 'end', icon: 'close', role: 'cancel' }]
    });
    await toast.present();
  }
}
