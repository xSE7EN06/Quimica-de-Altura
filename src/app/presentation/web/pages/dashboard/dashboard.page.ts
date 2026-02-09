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

  // 1. Plantas más consultadas (Horizontal Bar Chart)
  public plantsChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Aloe Vera', 'Manzanilla', 'Mentol', 'Arnica', 'Eucalipto', 'Muicle'],
    datasets: [
      {
        data: [450, 380, 320, 290, 210, 180],
        label: 'Consultas',
        backgroundColor: '#2ecc71',
        borderRadius: 8,
        barThickness: 24,
        hoverBackgroundColor: '#27ae60'
      }
    ]
  };

  public plantsChartOptions: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1f2329',
        padding: 12,
        cornerRadius: 10
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#8e95a2' }
      },
      y: {
        grid: { display: false },
        ticks: { color: '#8e95a2', font: { weight: 'bold', size: 13 } }
      }
    }
  };

  // 2. Módulos más clickeados (Doughnut Chart)
  public modulesChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Plantas', 'Propiedades', 'ID por Foto', 'Chat Yolotl'],
    datasets: [
      {
        data: [40, 25, 20, 15],
        backgroundColor: ['#2ecc71', '#3498db', '#f1c40f', '#9b59b6'],
        borderWidth: 0,
        hoverOffset: 12
      }
    ]
  };

  public modulesChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#8e95a2',
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 25,
          font: { size: 12 }
        }
      }
    },
    cutout: '65%'
  };

  // 3. Malestares más buscados (Bar Chart)
  public ailmentsChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Dolor de cabeza', 'Dolor de panza', 'Insomnio', 'Ansiedad', 'Tos', 'Gripe'],
    datasets: [
      {
        data: [620, 540, 480, 410, 350, 310],
        backgroundColor: '#3498db',
        borderRadius: 6,
        barThickness: 30
      }
    ]
  };

  public ailmentsChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#8e95a2', font: { size: 11 } }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#8e95a2' },
        beginAtZero: true
      }
    }
  };

  // 4. Propiedades más consultadas (Radar or Horizontal Bar)
  public propertiesChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Antiinflamatorio', 'Relajante', 'Digestivo', 'Analgésico', 'Antibiótico', 'Expectorante'],
    datasets: [
      {
        data: [780, 690, 640, 590, 420, 380],
        backgroundColor: '#f1c40f',
        borderRadius: 8,
        barThickness: 24
      }
    ]
  };

  public propertiesChartOptions: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#8e95a2' }
      },
      y: {
        grid: { display: false },
        ticks: { color: '#8e95a2', font: { weight: 600 } }
      }
    }
  };

  // 5. Métodos de preparación (Polar Area or Bar)
  public methodsChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Infusión', 'Decocción', 'Tintura', 'Compresa', 'Cataplasma'],
    datasets: [
      {
        data: [85, 45, 30, 25, 15],
        label: 'Uso %',
        backgroundColor: '#9b59b6',
        borderRadius: 6,
        barThickness: 40
      }
    ]
  };

  public methodsChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#8e95a2' }
      },
      y: {
        max: 100,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: {
          color: '#8e95a2',
          callback: (value) => value + '%'
        }
      }
    }
  };
}
