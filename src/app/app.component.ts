import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { DecimalPipe, NgIf } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouterOutlet, RouterLink, DecimalPipe, NgIf],
})
export class AppComponent implements OnInit {
  protected isMainPage: boolean = true;
  protected isPlaying: boolean = false;
  protected albumsInOrder: string[] = [];
  protected albums: string[] = [];
  protected minutes: number = 0;
  protected seconds: number = 0;
  protected intervalId: any;

  constructor(private router: Router) {
    for (let i = 0; i < 14; i++) {
      this.albumsInOrder.push(`assets/album-${i < 10 ? '0' + i : i}.jpg`, `assets/album-${i < 10 ? '0' + i : i}.jpg`);
    }
    this.albums = this.albumsInOrder.slice();
  }

  protected order() {
    this.albums = this.albumsInOrder.slice();
  }

  protected shuffle(array: string[]): string[] {
    const shuffledArr = array.slice();
    for (let i = shuffledArr.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [shuffledArr[i], shuffledArr[j]] = [shuffledArr[j], shuffledArr[i]];
    }
    return shuffledArr;
  }

  protected play(): void {
    this.isPlaying = true;
    this.albums = this.shuffle(this.albumsInOrder);
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
    this.order();
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => (this.isMainPage = this.router.url === '/'));
  }
}
