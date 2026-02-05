import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ScanResultCardComponent } from '../../components/scan-result-card/scan-result-card.component';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.page.html',
  styleUrls: ['./scan.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ScanResultCardComponent]
})
export class ScanPage implements OnInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  
  stream: MediaStream | null = null;
  isScanning: boolean = true;
  showResult: boolean = false; // Set to true to test the card

  // Mock data for result
  scannedPlant = {
    scientificName: 'Heterotheca inuloides Cass.',
    commonName: 'Árnica mexicana',
    description: 'La árnica mexicana es una planta perenne que crece en regiones montañosas y templadas de México, especialmente en estados como Puebla, Veracruz, Oaxaca y Michoacán. Alcanza entre 30 y 60 cm de altura, tiene tallos erectos y flores amarillas que se asemejan a pequeñas margaritas. Su aroma es fuerte y característico.',
    properties: [
      { name: 'Antinflamatoria', value: 95, icon: 'bandage-outline' }, // using ionic icons for now as placeholder
      { name: 'Analgésica', value: 90, icon: 'water-outline' },
      { name: 'Antibacterial', value: 85, icon: 'thermometer-outline' }
    ]
  };

  constructor() { }

  ngOnInit() {
    this.startCamera();
  }

  ngOnDestroy() {
    this.stopCamera();
  }

  async startCamera() {
    try {
      const constraints = {
        video: {
          facingMode: 'environment' // Use back camera on mobile
        }
      };
      
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (this.videoElement && this.videoElement.nativeElement) {
        this.videoElement.nativeElement.srcObject = this.stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      // Handle permission errors or absence of camera
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  capture() {
    // Logic to capture image would go here
    // For now, toggle result to show the card
    this.showResult = true;
  }

  closeResult() {
    this.showResult = false;
  }
}
