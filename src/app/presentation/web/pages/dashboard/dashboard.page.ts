import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, BaseChartDirective],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage {

  // Line Chart (Bi-curved smooth)
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', 'Ahora'],
    datasets: [
      {
        data: [45, 25, 60, 120, 150, 100, 115],
        label: 'Total',
        fill: true,
        tension: 0.5,
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.1)',
        pointBackgroundColor: '#3498db',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#3498db',
      },
      {
        data: [40, 22, 55, 110, 140, 95, 110],
        label: 'Exitosas',
        fill: true,
        tension: 0.5,
        borderColor: '#2ecc71',
        backgroundColor: 'rgba(46, 204, 113, 0.1)',
        pointBackgroundColor: '#2ecc71',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#2ecc71',
      }
    ]
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }, // Custom legend in HTML
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: '#1f2329',
        titleColor: '#fff',
        bodyColor: '#8e95a2',
        borderColor: '#333',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: { display: false, color: '#333' },
        ticks: { color: '#8e95a2' }
      },
      y: {
        grid: { color: '#1f2329' },
        ticks: { color: '#8e95a2' },
        beginAtZero: true
      }
    }
  };

  // Bar Chart (Horizontal)
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['GBIF', 'NCBI', 'PubMed', 'Kew', 'iNaturalist'],
    datasets: [
      {
        data: [1200, 980, 1100, 450, 800],
        label: 'Consultas',
        backgroundColor: '#2ecc71',
        borderRadius: 4,
        barThickness: 20
      }
    ]
  };

  public barChartOptions: ChartOptions<'bar'> = {
    indexAxis: 'y', // Horizontal
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { color: '#1f2329' },
        ticks: { color: '#8e95a2' }
      },
      y: {
        grid: { display: false },
        ticks: { color: '#8e95a2', font: { weight: 'bold' } }
      }
    }
  };

  // Doughnut Chart (Sources)
  public doughnutChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Base de Datos', 'Artículos', 'IA Generado'],
    datasets: [
      {
        data: [45, 30, 25],
        backgroundColor: ['#2ecc71', '#3498db', '#f1c40f'],
        hoverBackgroundColor: ['#27ae60', '#2980b9', '#f39c12'],
        borderWidth: 0,
        hoverOffset: 4
      }
    ]
  };

  public doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          color: '#8e95a2',
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20
        }
      }
    },
    cutout: '60%' // Donut thickness
  };

  // Vertical Bar Chart (Families)
  public familiesChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Asteraceae', 'Fabaceae', 'Lamiaceae', 'Rosaceae', 'Poaceae'],
    datasets: [
      {
        data: [240, 180, 150, 130, 100],
        backgroundColor: '#2ecc71',
        borderRadius: 4,
        barThickness: 40
      }
    ]
  };

  public familiesChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#8e95a2' }
      },
      y: {
        grid: { color: '#1f2329', tickLength: 10 },
        ticks: { color: '#8e95a2' },
        beginAtZero: true
      }
    }
  };
}
