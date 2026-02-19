import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  isDarkTheme = false;

  ngOnInit() {
    document.body.setAttribute('data-theme', 'light');
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    document.body.setAttribute('data-theme', this.isDarkTheme ? 'dark' : 'light');
  }
}
