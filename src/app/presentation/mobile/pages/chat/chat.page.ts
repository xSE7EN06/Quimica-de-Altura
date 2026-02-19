import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonContent } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowBackOutline, micOutline, send } from 'ionicons/icons';
import { HeaderComponent } from '../../components/header/header.component';

interface ChatMessage {
    id: number;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    isImage?: boolean; // For future use if image support is needed
    properties?: string[]; // For bot messages with lists
}

@Component({
    selector: 'app-chat',
    templateUrl: './chat.page.html',
    styleUrls: ['./chat.page.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule, FormsModule, HeaderComponent]
})
export class ChatPage {

    messages: ChatMessage[] = [
        {
            id: 1,
            text: '¡Hola! 🌿 Soy Yolotl, tu guía en el conocimiento de las plantas medicinales mexicanas.',
            sender: 'bot',
            timestamp: new Date()
        },
        {
            id: 2,
            text: '¡Hola! Quiero saber sobre el árnica.',
            sender: 'user',
            timestamp: new Date()
        },
        {
            id: 3,
            text: 'El árnica mexicana (Heterotheca inuloides) es una planta de las montañas con propiedades antiinflamatorias y analgésicas muy potentes.\n\nNivel de curación estimado: 82%\n✨ Propiedades:',
            sender: 'bot',
            timestamp: new Date()
        },
        {
            id: 4,
            text: 'Muéstrame sus compuestos.',
            sender: 'user',
            timestamp: new Date()
        },
        {
            id: 5,
            text: 'Claro 🌿\nLos principales compuestos del árnica son:\n• Helenalina: responsable del efecto antiinflamatorio.\n• Quercetina y Luteolina: antioxidantes naturales.\n\n⚠️ Recuerda: su uso debe ser externo, no ingerible.',
            sender: 'bot',
            timestamp: new Date()
        }
    ];

    @ViewChild(IonContent) content!: IonContent;

    newMessage = '';

    constructor() {
        addIcons({ arrowBackOutline, micOutline, send });
    }

    sendMessage() {
        if (this.newMessage.trim().length === 0) return;

        this.messages.push({
            id: Date.now(),
            text: this.newMessage,
            sender: 'user',
            timestamp: new Date()
        });

        this.newMessage = '';
        this.scrollToBottom();

        // Mock bot response
        setTimeout(() => {
            this.messages.push({
                id: Date.now(),
                text: 'Entendido. ¿Necesitas más información?',
                sender: 'bot',
                timestamp: new Date()
            });
            this.scrollToBottom();
        }, 1000);
    }

    scrollToBottom() {
        setTimeout(() => {
            this.content.scrollToBottom(300);
        }, 100);
    }
}
