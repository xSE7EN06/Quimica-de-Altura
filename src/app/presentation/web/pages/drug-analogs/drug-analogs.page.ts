import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-drug-analogs',
  standalone: true,
  imports: [CommonModule, MatIconModule, BaseChartDirective],
  templateUrl: './drug-analogs.page.html',
  styleUrls: ['./drug-analogs.page.scss']
})
export class DrugAnalogsPage {

  public statCards = [
    { icon: 'medication', value: '156', label: 'Fármacos mapeados' },
    { icon: 'link', value: '423', label: 'Análogos encontrados' },
    { icon: 'percent', value: '71.4%', label: 'Similaridad promedio' },
    { icon: 'hub', value: '89', label: 'Alta superposición vías' }
  ];

  // Bar chart: Puntajes de Similitud por Compuesto
  public similarityChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Berberina', 'Linalool', 'Apigenina', 'Eugenol', 'Quercetina', 'Ácido Salicílico', 'Safrol', 'Anetol'],
    datasets: [
      {
        data: [78, 71, 65, 55, 60, 89, 52, 48],
        backgroundColor: '#3498db',
        borderRadius: 6,
        barThickness: 28
      }
    ]
  };

  public similarityChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#8e95a2' } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8e95a2' }, beginAtZero: true }
    }
  };

  // Doughnut chart: Superposición de Vías Metabólicas
  public pathwaysChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: [
      'AMPK / Gluconeogénesis',
      'COX-1/2 Inhibición',
      'GABA-A Modulación',
      'H+/K+ ATPasa',
      'Receptor H1',
      'Otras vías'
    ],
    datasets: [
      {
        data: [22, 19, 15, 12, 10, 22],
        backgroundColor: ['#e74c3c', '#f1c40f', '#9b59b6', '#2ecc71', '#3498db', '#95a5a6'],
        borderWidth: 0,
        hoverOffset: 12
      }
    ]
  };

  public pathwaysChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: { color: '#8e95a2', usePointStyle: true, pointStyle: 'circle', padding: 20 }
      }
    }
  };
}
