import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-biodiversity',
  standalone: true,
  imports: [CommonModule, MatIconModule, BaseChartDirective],
  templateUrl: './biodiversity.page.html',
  styleUrls: ['./biodiversity.page.scss']
})
export class BiodiversityPage {

  public statCards = [
    { icon: 'forest', value: '487', label: 'Especies documentadas' },
    { icon: 'eco', value: '312', label: 'Con fitoquímica' },
    { icon: 'biotech', value: '89', label: 'Con datos genómicos' },
    { icon: 'star', value: '143', label: 'Endémicas de México' }
  ];

  // Bar chart: Cobertura por Estado
  public coverageChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Oaxaca', 'Chiapas', 'Veracruz', 'Guerrero', 'Michoacán', 'Hidalgo', 'Puebla', 'Jalisco'],
    datasets: [
      {
        data: [78, 71, 65, 58, 52, 48, 44, 41],
        backgroundColor: '#2ecc71',
        borderRadius: 6,
        barThickness: 30
      }
    ]
  };

  public coverageChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#8e95a2' } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8e95a2' }, beginAtZero: true }
    }
  };

  // Doughnut chart: Completitud de Datos
  public completenessChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Completos', 'Parciales', 'Mínimos'],
    datasets: [
      {
        data: [35, 45, 20],
        backgroundColor: ['#2ecc71', '#f1c40f', '#e74c3c'],
        borderWidth: 0,
        hoverOffset: 12
      }
    ]
  };

  public completenessChartOptions: ChartOptions<'doughnut'> = {
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
