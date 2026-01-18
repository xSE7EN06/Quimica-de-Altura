import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonMenuButton } from '@ionic/angular/standalone';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: true,
    imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonMenuButton]
})
export class HeaderComponent implements OnInit {
    @Input() title: string = '';
    @Input() defaultHref: string = '/';
    @Input() showBackButton: boolean = false;

    constructor() { }

    ngOnInit() { }
}
