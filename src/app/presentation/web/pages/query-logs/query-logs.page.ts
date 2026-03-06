import { Component, ViewChild, TemplateRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { DataTableComponent, ColumnConfig } from '../../components/data-table/data-table.component';
import { QueryLogModalComponent } from '../../components/query-log-modal/query-log-modal.component';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';
import { QueryLog } from '../../../../domain/models/query-log.entity';
import { QueryLogRepository } from '../../../../domain/repositories/query-log.repository';
import { ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircle, trash, alertCircle } from 'ionicons/icons';

@Component({
  selector: 'app-query-logs',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule, DataTableComponent, QueryLogModalComponent, ConfirmationModalComponent],
  templateUrl: './query-logs.page.html',
  styleUrls: ['./query-logs.page.scss']
})
export class QueryLogsPage implements OnInit {
  items: QueryLog[] = [];
  private originalItems: QueryLog[] = [];
  columns: ColumnConfig[] = [];
  activeFilters: Record<string, string[]> = { flagged: [] };
  selectedFlagged = '';
  searchTerm = '';
  tableLoading = true;

  @ViewChild('queryTpl', { static: true }) queryTpl!: TemplateRef<any>;
  @ViewChild('entitiesTpl', { static: true }) entitiesTpl!: TemplateRef<any>;
  @ViewChild('flaggedTpl', { static: true }) flaggedTpl!: TemplateRef<any>;
  @ViewChild(DataTableComponent) dataTable!: DataTableComponent;
  @ViewChild(QueryLogModalComponent) itemModal!: QueryLogModalComponent;
  @ViewChild(ConfirmationModalComponent) confirmModal!: ConfirmationModalComponent;

  private selectedItemId?: string;
  currentIndex = -1;
  selectedItem?: QueryLog;

  get hasPrevious(): boolean { return this.currentIndex > 0; }
  get hasNext(): boolean { return this.currentIndex < this.items.length - 1; }

  constructor(
    private repo: QueryLogRepository,
    private toastController: ToastController,
    private cdr: ChangeDetectorRef
  ) { addIcons({ checkmarkCircle, trash, alertCircle }); }

  ngOnInit() {
    this.loadData();
    this.columns = [
      { key: 'query', header: 'Consulta', cellTemplate: this.queryTpl },
      { key: 'extractedEntities', header: 'Entidades', cellTemplate: this.entitiesTpl },
      { key: 'confidence', header: 'Confianza' },
      { key: 'flagged', header: 'Marcado', cellTemplate: this.flaggedTpl },
      { key: 'userId', header: 'Usuario' },
      { key: 'createdAt', header: 'Fecha' }
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
    if (this.activeFilters['flagged']?.length > 0) {
      const showFlagged = this.activeFilters['flagged'].includes('true');
      filtered = filtered.filter(i => i.flagged === showFlagged);
    }
    this.items = filtered;
  }

  onAddItem() { this.itemModal.open('add'); }
  onViewItem(item: QueryLog) { this.selectedItem = item; this.currentIndex = this.items.indexOf(item); this.itemModal.open('view', item); }
  onEditItem(item: QueryLog) { this.selectedItem = item; this.currentIndex = this.items.indexOf(item); this.itemModal.open('edit', item); }
  onPrevItem() { if (this.hasPrevious) { this.currentIndex--; this.selectedItem = this.items[this.currentIndex]; this.itemModal.open('view', this.selectedItem); } }
  onNextItem() { if (this.hasNext) { this.currentIndex++; this.selectedItem = this.items[this.currentIndex]; this.itemModal.open('view', this.selectedItem); } }
  onDeleteItem(item: QueryLog) { this.selectedItemId = item.id; this.confirmModal.open(); }

  onBulkDelete(items: QueryLog[]) {
    this.confirmModal.title = `Eliminar ${items.length} logs`;
    this.confirmModal.message = `¿Eliminar los ${items.length} logs seleccionados?`;
    this.selectedItemId = items.map(i => i.id).join(',');
    this.confirmModal.open();
  }

  onConfirmDelete() {
    if (this.selectedItemId) {
      const ids = this.selectedItemId.split(',');
      ids.forEach(id => this.repo.delete(id).subscribe(() => this.loadData()));
      this.showToast(`${ids.length} log(s) eliminado(s)`, 'trash', 'danger');
      this.selectedItemId = undefined;
    }
    this.loadData();
  }

  onSaveItem(item: QueryLog) {
    if (item.id) {
      this.repo.update(item).subscribe(() => { this.loadData(); this.showToast('Log actualizado', 'checkmark-circle'); });
    } else {
      this.repo.add(item).subscribe(() => { this.loadData(); this.showToast('Log agregado', 'checkmark-circle'); });
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

  onResetFilters() { this.activeFilters = { flagged: [] }; this.applyFilters(); }

  getConfidencePct(v: number): string { return (v * 100).toFixed(1) + '%'; }
  truncate(s: string, n = 60): string { return s.length > n ? s.substring(0, n) + '…' : s; }

  private async showToast(message: string, icon: string, color: string = 'dark') {
    const toast = await this.toastController.create({
      header: '¡Éxito!', message, duration: 3000, position: 'bottom', color, icon,
      cssClass: 'custom-success-toast', buttons: [{ side: 'end', icon: 'close', role: 'cancel' }]
    });
    await toast.present();
  }
}
