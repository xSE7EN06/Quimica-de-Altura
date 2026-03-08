import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-evidence-quality',
  standalone: true,
  imports: [CommonModule, MatIconModule, BaseChartDirective],
  templateUrl: './evidence-quality.page.html',
  styleUrls: ['./evidence-quality.page.scss']
})
export class EvidenceQualityPage {

  public statCards = [
    { icon: 'verified', value: '124', label: 'Nivel L1 (Ensayos)' },
    { icon: 'science', value: '287', label: 'Nivel L2 (Estudios)' },
    { icon: 'menu_book', value: '413', label: 'Nivel L3 (Etnobotánica)' },
    { icon: 'history_edu', value: '651', label: 'Nivel L4 (Tradición)' }
  ];

  // Doughnut chart: Distribución L1–L4
  public distributionChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['L1 Ensayos clínicos', 'L2 Estudios in vivo', 'L3 Etnobotánica doc.', 'L4 Tradición oral'],
    datasets: [
      {
        data: [8, 19, 28, 45],
        backgroundColor: ['#2ecc71', '#3498db', '#f1c40f', '#e74c3c'],
        borderWidth: 0,
        hoverOffset: 12
      }
    ]
  };

  public distributionChartOptions: ChartOptions<'doughnut'> = {
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

  // Bar chart: Oportunidades de Investigación por Especie
  public opportunitiesChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [
      'Psacalium decomp.',
      'Turnera diffusa',
      'Buddleja cordata',
      'Eryngium carlinae',
      'Loeselia mexicana',
      'Borreria laevis'
    ],
    datasets: [
      {
        data: [45, 38, 32, 28, 24, 19],
        backgroundColor: '#3498db',
        borderRadius: 6,
        barThickness: 30
      }
    ]
  };

  public opportunitiesChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#8e95a2' } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8e95a2' }, beginAtZero: true }
    }
  };
}
