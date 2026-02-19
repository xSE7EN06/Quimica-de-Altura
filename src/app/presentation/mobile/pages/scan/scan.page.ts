import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController } from '@ionic/angular';
import { ScanResultCardComponent } from '../../components/scan-result-card/scan-result-card.component';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  cameraOutline,
  bandageOutline,
  waterOutline,
  thermometerOutline,
  happyOutline,
  informationCircleOutline
} from 'ionicons/icons';

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
  showResult: boolean = false;
  isLoading: boolean = false;

  // Mock data for result
  scannedPlant = {
    scientificName: 'Heterotheca inuloides Cass.',
    commonName: 'Árnica mexicana',
    description: 'La árnica mexicana es una planta perenne que crece en regiones montañosas y templadas de México, especialmente en estados como Puebla, Veracruz, Oaxaca y Michoacán. Alcanza entre 30 y 60 cm de altura, tiene tallos erectos y flores amarillas que se asemejan a pequeñas margaritas. Su aroma es fuerte y característico.',
    properties: [
      { name: 'Antinflamatoria', value: 95, icon: 'bandage-outline' },
      { name: 'Analgésica', value: 90, icon: 'water-outline' },
      { name: 'Antibacterial', value: 85, icon: 'thermometer-outline' }
    ]
  };

  constructor(
    private navCtrl: NavController,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({
      arrowBackOutline,
      cameraOutline,
      bandageOutline,
      waterOutline,
      thermometerOutline,
      happyOutline,
      informationCircleOutline
    });
  }

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
          facingMode: 'environment'
        }
      };

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        this.stream = await navigator.mediaDevices.getUserMedia(constraints);

        if (this.videoElement && this.videoElement.nativeElement) {
          this.videoElement.nativeElement.srcObject = this.stream;
        }
      }
    } catch (err) {
      console.warn('Camera access issue:', err);
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  capture() {
    if (this.isLoading) return;

    this.isLoading = true;
    console.log('Capture started, loading...');

    setTimeout(() => {
      // Run inside Angular zone and force detection
      this.ngZone.run(() => {
        console.log('Timeout finished. Stopping loading, showing result.');
        this.isLoading = false;
        this.showResult = true;
        this.cdr.detectChanges(); // Explicitly trigger change detection
      });
    }, 2000);
  }

  closeResult() {
    this.showResult = false;
    this.cdr.detectChanges();
  }

  goBack() {
    this.navCtrl.back();
  }
}
