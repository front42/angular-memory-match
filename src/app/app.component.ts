import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouterOutlet, RouterLink, DecimalPipe],
})
export class AppComponent implements OnInit {
  protected isMainPage: boolean = true;
  protected isPlaying: boolean = false;
  protected discs: string[] = [];
  protected minutes: number = 0;
  protected seconds: number = 0;
  protected intervalId: any;

  constructor(private router: Router) {
    for (let i = 0; i < 14; i++) {
      this.discs.push(`assets/disc-${i < 10 ? '0' + i : i}.jpg`, `assets/disc-${i < 10 ? '0' + i : i}.jpg`);
    }
  }

  protected shuffle(array: string[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  protected play(): void {
    this.isPlaying = true;
    this.shuffle(this.discs);
    this.intervalId = setInterval(() => {
      this.seconds += 1;
      if (this.seconds === 60) {
        this.seconds = 0;
        this.minutes += 1;
      }
    }, 1000);
  }

  protected stop(): void {
    this.isPlaying = false;
    this.minutes = this.seconds = 0;
    clearInterval(this.intervalId);
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => (this.isMainPage = this.router.url === '/'));
  }
}
