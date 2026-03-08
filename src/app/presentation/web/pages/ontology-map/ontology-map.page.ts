import { Component, ViewChild, TemplateRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { DataTableComponent, ColumnConfig } from '../../components/data-table/data-table.component';
import { OntologyModalComponent } from '../../components/ontology-modal/ontology-modal.component';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';
import { OntologyTerm } from '../../../../domain/models/ontology-term.entity';
import { OntologyTermRepository } from '../../../../domain/repositories/ontology-term.repository';
import { ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircle, trash, alertCircle } from 'ionicons/icons';

@Component({
  selector: 'app-ontology-map',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule, DataTableComponent, OntologyModalComponent, ConfirmationModalComponent],
  templateUrl: './ontology-map.page.html',
  styleUrls: ['./ontology-map.page.scss']
})
export class OntologyMapPage implements OnInit {
  items: OntologyTerm[] = [];
  private originalItems: OntologyTerm[] = [];
  columns: ColumnConfig[] = [];
  activeFilters: Record<string, string[]> = { category: [] };
  selectedCategory = '';
  searchTerm = '';
  tableLoading = true;

  @ViewChild('termTpl', { static: true }) termTpl!: TemplateRef<any>;
  @ViewChild('synonymsTpl', { static: true }) synonymsTpl!: TemplateRef<any>;
  @ViewChild(DataTableComponent) dataTable!: DataTableComponent;
  @ViewChild(OntologyModalComponent) itemModal!: OntologyModalComponent;
  @ViewChild(ConfirmationModalComponent) confirmModal!: ConfirmationModalComponent;

  private selectedItemId?: string;
  currentIndex = -1;
  selectedItem?: OntologyTerm;

  get hasPrevious(): boolean { return this.currentIndex > 0; }
  get hasNext(): boolean { return this.currentIndex < this.items.length - 1; }

  constructor(
    private repo: OntologyTermRepository,
    private toastController: ToastController,
    private cdr: ChangeDetectorRef
  ) { addIcons({ checkmarkCircle, trash, alertCircle }); }

  ngOnInit() {
    this.loadData();
    this.columns = [
      { key: 'canonicalTerm', header: 'Término Canónico', cellTemplate: this.termTpl },
      { key: 'icd10Code', header: 'ICD-10' },
      { key: 'meshId', header: 'MeSH ID' },
      { key: 'category', header: 'Categoría' },
      { key: 'synonyms', header: 'Sinónimos', cellTemplate: this.synonymsTpl }
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
    if (this.activeFilters['category']?.length > 0) {
      filtered = filtered.filter(i => this.activeFilters['category'].includes(i.category));
    }
    this.items = filtered;
  }

  onAddItem() { this.itemModal.open('add'); }

  onViewItem(item: OntologyTerm) {
    this.selectedItem = item;
    this.currentIndex = this.items.indexOf(item);
    this.itemModal.open('view', item);
  }

  onEditItem(item: OntologyTerm) {
    this.selectedItem = item;
    this.currentIndex = this.items.indexOf(item);
    this.itemModal.open('edit', item);
  }

  onPrevItem() { if (this.hasPrevious) { this.currentIndex--; this.selectedItem = this.items[this.currentIndex]; this.itemModal.open('view', this.selectedItem); } }
  onNextItem() { if (this.hasNext) { this.currentIndex++; this.selectedItem = this.items[this.currentIndex]; this.itemModal.open('view', this.selectedItem); } }

  onDeleteItem(item: OntologyTerm) { this.selectedItemId = item.id; this.confirmModal.open(); }

  onBulkDelete(items: OntologyTerm[]) {
    this.confirmModal.title = `Eliminar ${items.length} términos`;
    this.confirmModal.message = `¿Estás seguro de que deseas eliminar los ${items.length} términos seleccionados?`;
    this.selectedItemId = items.map(i => i.id).join(',');
    this.confirmModal.open();
  }

  onConfirmDelete() {
    if (this.selectedItemId) {
      const ids = this.selectedItemId.split(',');
      ids.forEach(id => this.repo.delete(id).subscribe(() => this.loadData()));
      this.showToast(`${ids.length} término(s) eliminado(s)`, 'trash', 'danger');
      this.selectedItemId = undefined;
    }
    this.loadData();
  }

  onSaveItem(item: OntologyTerm) {
    if (item.id) {
      this.repo.update(item).subscribe(() => { this.loadData(); this.showToast('Término actualizado correctamente', 'checkmark-circle'); });
    } else {
      this.repo.add(item).subscribe(() => { this.loadData(); this.showToast('Término agregado correctamente', 'checkmark-circle'); });
    }
  }

  onFilterChange(type: string, value: string) {
    if (value && !this.activeFilters[type]?.includes(value)) {
      if (!this.activeFilters[type]) this.activeFilters[type] = [];
      this.activeFilters[type].push(value);
      this.applyFilters();
      this.cdr.detectChanges();
    }
  }

  removeFilter(type: string, value: string) {
    const idx = this.activeFilters[type]?.indexOf(value);
    if (idx > -1) { this.activeFilters[type].splice(idx, 1); this.applyFilters(); }
  }

  onResetFilters() {
    this.activeFilters = { category: [] };
    this.applyFilters();
  }

  getCategories(): string[] {
    return [...new Set(this.originalItems.map(i => i.category))];
  }

  private async showToast(message: string, icon: string, color: string = 'dark') {
    const toast = await this.toastController.create({
      header: '¡Éxito!', message, duration: 3000, position: 'bottom', color, icon,
      cssClass: 'custom-success-toast', buttons: [{ side: 'end', icon: 'close', role: 'cancel' }]
    });
    await toast.present();
  }
}
