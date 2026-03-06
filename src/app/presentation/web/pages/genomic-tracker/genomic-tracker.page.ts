import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-genomic-tracker',
  standalone: true,
  imports: [CommonModule, MatIconModule, BaseChartDirective],
  templateUrl: './genomic-tracker.page.html',
  styleUrls: ['./genomic-tracker.page.scss']
})
export class GenomicTrackerPage {

  public statCards = [
    { icon: 'analytics', value: '1,247', label: 'Actividades inferidas' },
    { icon: 'verified_user', value: '389', label: 'Validadas' },
    { icon: 'flag', value: '78', label: 'Marcadas para revisión' },
    { icon: 'hourglass_empty', value: '312', label: 'Pendientes' }
  ];

  // Grouped Bar chart: Inferidas vs. Validadas por Especie
  public inferredChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Acuyo', 'Muicle', 'Matarique', 'Árnica Mex.', 'Toronjil', 'Damiana', 'Tepozán'],
    datasets: [
      {
        label: 'Inferidas',
        data: [45, 38, 52, 29, 34, 41, 28],
        backgroundColor: '#3498db',
        borderRadius: 4
      },
      {
        label: 'Validadas',
        data: [18, 22, 15, 24, 19, 12, 31],
        backgroundColor: '#2ecc71',
        borderRadius: 4
      }
    ]
  };

  public inferredChartOptions: ChartOptions<'bar'> = {
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

  // Doughnut chart: Niveles de Confianza
  public confidenceChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Alta (>85%)', 'Media (60–85%)', 'Baja (<60%)'],
    datasets: [
      {
        data: [42, 35, 23],
        backgroundColor: ['#2ecc71', '#f1c40f', '#e74c3c'],
        borderWidth: 0,
        hoverOffset: 12
      }
    ]
  };

  public confidenceChartOptions: ChartOptions<'doughnut'> = {
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
