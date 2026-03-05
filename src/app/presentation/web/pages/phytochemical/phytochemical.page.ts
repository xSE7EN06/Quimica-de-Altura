import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-phytochemical',
  standalone: true,
  imports: [CommonModule, MatIconModule, BaseChartDirective],
  templateUrl: './phytochemical.page.html',
  styleUrls: ['./phytochemical.page.scss']
})
export class PhytochemicalPage {

  public statCards = [
    { icon: 'science', value: '2,847', label: 'Compuestos totales' },
    { icon: 'category', value: '634', label: 'Alcaloides' },
    { icon: 'spa', value: '891', label: 'Terpenoides' },
    { icon: 'local_florist', value: '512', label: 'Flavonoides' }
  ];

  // Doughnut chart: Clases de Compuestos
  public classesChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Terpenoides', 'Alcaloides', 'Flavonoides', 'Fenoles', 'Esteroides', 'Otros'],
    datasets: [
      {
        data: [31, 22, 18, 14, 9, 6],
        backgroundColor: ['#9b59b6', '#e74c3c', '#f1c40f', '#2ecc71', '#3498db', '#95a5a6'],
        borderWidth: 0,
        hoverOffset: 12
      }
    ]
  };

  public classesChartOptions: ChartOptions<'doughnut'> = {
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

  // Bar chart: Actividad Farmacológica
  public activityChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Antiinflamatorio', 'Antioxidante', 'Antimicrobiano', 'Antidiabético', 'Ansiolítico', 'Analgésico'],
    datasets: [
      {
        data: [420, 380, 310, 245, 198, 167],
        backgroundColor: '#9b59b6',
        borderRadius: 6,
        barThickness: 30
      }
    ]
  };

  public activityChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#8e95a2' } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8e95a2' }, beginAtZero: true }
    }
  };
}
