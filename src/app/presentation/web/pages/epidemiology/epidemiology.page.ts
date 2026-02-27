import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-epidemiology',
  standalone: true,
  imports: [CommonModule, MatIconModule, BaseChartDirective],
  templateUrl: './epidemiology.page.html',
  styleUrls: ['./epidemiology.page.scss']
})
export class EpidemiologyPage {

  public statCards = [
    { icon: 'search', value: '48,291', label: 'Consultas totales' },
    { icon: 'location_on', value: '31', label: 'Regiones registradas' },
    { icon: 'calendar_today', value: 'Enero', label: 'Pico estacional' },
    { icon: 'trending_up', value: 'Cefalea', label: 'Síntoma más frecuente' }
  ];

  // Bar chart: Top 10 Síntomas Consultados
  public symptomsChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [
      'Dolor de cabeza', 'Diabetes', 'Ansiedad', 'Insomnio', 'Gastritis',
      'Gripe', 'Artritis', 'Fatiga', 'Depresión', 'Hipertensión'
    ],
    datasets: [
      {
        data: [8420, 6750, 5930, 5210, 4870, 4320, 3980, 3450, 3120, 2890],
        backgroundColor: '#3498db',
        borderRadius: 6,
        barThickness: 28
      }
    ]
  };

  public symptomsChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#8e95a2', font: { size: 11 } } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8e95a2' }, beginAtZero: true }
    }
  };

  // Line chart: Tendencia Mensual de Consultas 2024
  public trendChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    datasets: [
      {
        data: [3200, 2800, 3500, 4100, 3800, 4300, 4800, null, null, null, null, null],
        label: 'Consultas',
        borderColor: '#3498db',
        backgroundColor: 'rgba(52,152,219,0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#3498db',
        pointRadius: 4
      }
    ]
  };

  public trendChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#8e95a2' } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8e95a2' }, beginAtZero: true }
    }
  };
}
