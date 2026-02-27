import { Component, ViewChild, TemplateRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { DataTableComponent, ColumnConfig } from '../../components/data-table/data-table.component';
import { ImageLogModalComponent } from '../../components/image-log-modal/image-log-modal.component';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';
import { ImageLog } from '../../../../domain/models/image-log.entity';
import { ImageLogRepository } from '../../../../domain/repositories/image-log.repository';
import { ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircle, trash, alertCircle } from 'ionicons/icons';

@Component({
  selector: 'app-image-logs',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule, DataTableComponent, ImageLogModalComponent, ConfirmationModalComponent],
  templateUrl: './image-logs.page.html',
  styleUrls: ['./image-logs.page.scss']
})
export class ImageLogsPage implements OnInit {
  items: ImageLog[] = [];
  private originalItems: ImageLog[] = [];
  columns: ColumnConfig[] = [];
  activeFilters: Record<string, string[]> = { userFeedback: [], flagged: [] };
  selectedFeedback = '';
  selectedFlagged = '';
  searchTerm = '';
  tableLoading = true;

  @ViewChild('speciesTpl', { static: true }) speciesTpl!: TemplateRef<any>;
  @ViewChild('feedbackTpl', { static: true }) feedbackTpl!: TemplateRef<any>;
  @ViewChild('flaggedTpl', { static: true }) flaggedTpl!: TemplateRef<any>;
  @ViewChild(DataTableComponent) dataTable!: DataTableComponent;
  @ViewChild(ImageLogModalComponent) itemModal!: ImageLogModalComponent;
  @ViewChild(ConfirmationModalComponent) confirmModal!: ConfirmationModalComponent;

  private selectedItemId?: string;
  currentIndex = -1;
  selectedItem?: ImageLog;

  get hasPrevious(): boolean { return this.currentIndex > 0; }
  get hasNext(): boolean { return this.currentIndex < this.items.length - 1; }

  constructor(
    private repo: ImageLogRepository,
    private toastController: ToastController,
    private cdr: ChangeDetectorRef
  ) { addIcons({ checkmarkCircle, trash, alertCircle }); }

  ngOnInit() {
    this.loadData();
    this.columns = [
      { key: 'predictedSpecies', header: 'Especie Predicha', cellTemplate: this.speciesTpl },
      { key: 'confidence', header: 'Confianza' },
      { key: 'userFeedback', header: 'Feedback', cellTemplate: this.feedbackTpl },
      { key: 'flagged', header: 'Marcado', cellTemplate: this.flaggedTpl },
      { key: 'modelVersion', header: 'Modelo' },
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
    if (this.activeFilters['userFeedback']?.length > 0) filtered = filtered.filter(i => this.activeFilters['userFeedback'].includes(i.userFeedback));
    if (this.activeFilters['flagged']?.length > 0) {
      const showFlagged = this.activeFilters['flagged'].includes('true');
      filtered = filtered.filter(i => i.flagged === showFlagged);
    }
    this.items = filtered;
  }

  onAddItem() { this.itemModal.open('add'); }
  onViewItem(item: ImageLog) { this.selectedItem = item; this.currentIndex = this.items.indexOf(item); this.itemModal.open('view', item); }
  onEditItem(item: ImageLog) { this.selectedItem = item; this.currentIndex = this.items.indexOf(item); this.itemModal.open('edit', item); }
  onPrevItem() { if (this.hasPrevious) { this.currentIndex--; this.selectedItem = this.items[this.currentIndex]; } }
  onNextItem() { if (this.hasNext) { this.currentIndex++; this.selectedItem = this.items[this.currentIndex]; } }
  onDeleteItem(item: ImageLog) { this.selectedItemId = item.id; this.confirmModal.open(); }

  onBulkDelete(items: ImageLog[]) {
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

  onSaveItem(item: ImageLog) {
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

  onResetFilters() { this.activeFilters = { userFeedback: [], flagged: [] }; this.applyFilters(); }

  getFeedbackLabel(v: string): string { const m: Record<string, string> = { correct: 'Correcto', incorrect: 'Incorrecto', unsure: 'Inseguro' }; return m[v] || v; }
  getConfidencePct(v: number): string { return (v * 100).toFixed(1) + '%'; }

  private async showToast(message: string, icon: string, color: string = 'dark') {
    const toast = await this.toastController.create({
      header: '¡Éxito!', message, duration: 3000, position: 'bottom', color, icon,
      cssClass: 'custom-success-toast', buttons: [{ side: 'end', icon: 'close', role: 'cancel' }]
    });
    await toast.present();
  }
}
