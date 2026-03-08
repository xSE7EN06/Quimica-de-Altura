import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-research-gaps',
  standalone: true,
  imports: [CommonModule, MatIconModule, BaseChartDirective],
  templateUrl: './research-gaps.page.html',
  styleUrls: ['./research-gaps.page.scss']
})
export class ResearchGapsPage {

  public statCards = [
    { icon: 'find_in_page', value: '234', label: 'Brechas identificadas' },
    { icon: 'priority_high', value: '67', label: 'Alta prioridad' },
    { icon: 'article', value: '1,892', label: 'Citaciones recientes' },
    { icon: 'bubble_chart', value: '12', label: 'Nuevos clusters' }
  ];

  // Bar chart: Especies con Menor Publicación
  public lowPublicationChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [
      'Eryngium carlinae',
      'Loeselia mexicana',
      'Borreria laevis',
      'Dodonaea viscosa',
      'Karwinskia humboldtiana',
      'Zaluzania augusta'
    ],
    datasets: [
      {
        data: [3, 5, 7, 8, 11, 14],
        backgroundColor: '#e74c3c',
        borderRadius: 6,
        barThickness: 30
      }
    ]
  };

  public lowPublicationChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#8e95a2' } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8e95a2' }, beginAtZero: true }
    }
  };

  // Grouped Bar chart: Bioactividad Reportada vs. Ensayos Clínicos
  public bioactivityChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [
      'Psacalium decomp.',
      'Turnera diffusa',
      'Buddleja cordata',
      'Justicia spicigera',
      'Agastache mex.',
      'Artemisia ludov.'
    ],
    datasets: [
      {
        label: 'Bioactividad reportada',
        data: [45, 38, 32, 28, 52, 41],
        backgroundColor: '#3498db',
        borderRadius: 4
      },
      {
        label: 'Ensayos clínicos',
        data: [3, 2, 1, 4, 2, 5],
        backgroundColor: '#e74c3c',
        borderRadius: 4
      }
    ]
  };

  public bioactivityChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: { color: '#8e95a2', usePointStyle: true, pointStyle: 'circle', padding: 20 }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#8e95a2' } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8e95a2' }, beginAtZero: true }
    }
  };
}
