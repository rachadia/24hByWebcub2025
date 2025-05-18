import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { EventService } from '../../../services/event.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-event-podium',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './event-podium.component.html',
})
export class EventPodiumComponent implements OnInit {
  topEvents: any[] = [];
  loading = true;
  error = false;
  today = new Date();

  constructor(private eventService: EventService, private router: Router) {}

  ngOnInit(): void {
    this.eventService.getTopEvents().subscribe({
      next: (events) => {
        this.topEvents = events;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des événements', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  navigateToEvent(id: string): void {
    this.router.navigate(['/events', id]);
  }
} 