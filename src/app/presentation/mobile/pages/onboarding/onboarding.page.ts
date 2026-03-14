import { Component, OnInit, ChangeDetectorRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonButton, IonIcon, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonCheckbox, IonSpinner } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, IonIcon, IonModal, IonHeader, IonToolbar, IonButtons, IonCheckbox, IonSpinner, CommonModule, FormsModule]
})
export class OnboardingPage implements OnInit {
  @ViewChild('modal') modal!: any;
  currentStep = 0;
  showText = false;
  isShrunk = false;
  acceptedTerms = false;
  canDismiss = false;
  isLoading = false;
  private startX = 0;
  private startTime = 0;
  private cdr = inject(ChangeDetectorRef);

  steps = [
    {
      title: 'Explora la Química',
      description: 'Descubre los secretos de las plantas y sus compuestos químicos con tecnología de vanguardia.',
      image: 'yolotl-search.png'
    },
    {
      title: 'IA con Corazón',
      description: 'Yolotl utiliza inteligencia artificial para guiarte en tu viaje de aprendizaje botánico.',
      image: 'yolotl-heart.png'
    },
    {
      title: 'Comunidad Experta',
      description: 'Únete a miles de usuarios y expertos compartiendo conocimiento verificado.',
      image: 'yolotl-community.png'
    }
  ];

  constructor(private router: Router) { }

  ngOnInit() {
    // Reveal everything quickly and force detection
    setTimeout(() => {
      this.isShrunk = true;
      this.cdr.detectChanges();
    }, 100);

    setTimeout(() => {
      this.showText = true;
      this.cdr.detectChanges();
    }, 500);
  }

  async openModal() {
    await this.modal.present();
  }

  onCheckboxChange(event: any) {
    this.acceptedTerms = event.detail.checked;
    this.canDismiss = this.acceptedTerms;
    this.cdr.detectChanges();
  }

  toggleTermsInModal() {
    this.acceptedTerms = !this.acceptedTerms;
    this.canDismiss = this.acceptedTerms;
    this.cdr.detectChanges();
  }

  toggleMainTerms() {
    this.acceptedTerms = !this.acceptedTerms;
    this.canDismiss = this.acceptedTerms;
    this.cdr.detectChanges();
  }

  handleTouchStart(event: TouchEvent) {
    this.startX = event.touches[0].clientX;
    this.startTime = Date.now();
  }

  handleTouchEnd(event: TouchEvent) {
    const endX = event.changedTouches[0].clientX;
    const endTime = Date.now();
    const diffX = this.startX - endX;
    const diffTime = endTime - this.startTime;

    // Minimum swipe distance and maximum time
    if (Math.abs(diffX) > 50 && diffTime < 300) {
      if (diffX > 0) {
        this.nextStep(); // Swipe Left -> Next
      } else {
        this.prevStep(); // Swipe Right -> Prev
      }
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
    } else {
      if (this.acceptedTerms) {
        this.finish();
      }
    }
  }

  finish() {
    if (this.acceptedTerms) {
      this.isLoading = true;
      this.cdr.detectChanges();

      // Pequeño delay para que el spinner sea perceptible
      setTimeout(() => {
        this.router.navigate(['/login']).then(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        });
      }, 800);
    }
  }
}
