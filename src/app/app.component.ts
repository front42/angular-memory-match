import { Component, OnInit, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { DecimalPipe, NgClass } from '@angular/common';
import { filter } from 'rxjs';

import { DataService } from './data.service';

class Album {
  constructor(
    public front: string,
    public back: string,
    public isFlipped: boolean,
  ) {}
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss', './banner.scss'],
  imports: [RouterOutlet, RouterLink, DecimalPipe, NgClass],
})
export class AppComponent implements OnInit {
  protected isMainPage: boolean = true;
  protected isPlaying: boolean = false;
  protected isPregap: boolean = false;
  protected albumsInOrder: Album[] = [];
  protected albums: Album[] = [];
  protected minutes: number = 0;
  protected seconds: number = 0;
  protected intervalId: any;
  protected firstFlipped: Album | null = null;
  protected activeAnimation: boolean = false;
  protected matchCounter: number = 0;
  protected player: string = '';
  protected success: boolean = false;
  protected fail: boolean = false;

  constructor(
    private router: Router,
    private dataService: DataService,
  ) {
    for (let i = 0; i < 14; i++) {
      this.albumsInOrder.push(
        new Album(`url(assets/album-${i < 10 ? '0' + i : i}.jpg)`, 'url(assets/vinyl-lp.png)', true),
        new Album(`url(assets/album-${i < 10 ? '0' + i : i}.jpg)`, 'url(assets/vinyl-lp.png)', true),
      );
    }
    this.order();
  }

  protected order(): void {
    this.albums = this.albumsInOrder.slice();
  }

  protected shuffle(array: Album[]): Album[] {
    const shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  }

  protected play(): void {
    if (this.minutes || this.seconds) return;
    this.player = this.dataService.getSelectedPlayer();
    this.seconds = 10;
    this.isPregap = true;
    this.isPlaying = true;
    this.albums = this.shuffle(this.albumsInOrder);
    this.intervalId = setInterval(() => (this.seconds -= 1), 1000);
    setTimeout(() => {
      clearInterval(this.intervalId);
      this.seconds = 0;
      this.isPregap = false;
      this.albums.forEach((album) => (album.isFlipped = false));
      this.intervalId = setInterval(() => {
        this.seconds += 1;
        if (this.seconds === 60) {
          this.seconds = 0;
          this.minutes += 1;
        }
        if (this.minutes === 60) {
          clearInterval(this.intervalId);
          this.fail = true;
        }
      }, 1000);
    }, 10000);
  }

  protected stop(): void {
    clearInterval(this.intervalId);
    this.matchCounter = 0;
    this.isPlaying = false;
    this.firstFlipped = null;
    this.albums.forEach((album) => (album.isFlipped = false));
    setTimeout(() => {
      this.order();
      this.albums.forEach((album) => (album.isFlipped = true));
    }, 900);
    setTimeout(() => (this.minutes = this.seconds = 0), 1700);
  }

  protected closeBanner(): void {
    setTimeout(() => this.stop(), 500);
    this.success = false;
    this.fail = false;
  }

  protected toggleFullscreen(): void {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }

  @HostListener('document:keydown', ['$event']) handleF11Keydown(event: KeyboardEvent): void {
    if (event.code === 'F11') {
      event.preventDefault();
      this.toggleFullscreen();
    }
  }

  protected flipAlbum(album: Album): void {
    if (this.activeAnimation) return;
    this.activeAnimation = true;
    album.isFlipped = true;
    if (!this.firstFlipped) {
      this.activeAnimation = false;
      this.firstFlipped = album;
    } else if (this.firstFlipped.front === album.front) {
      this.matchCounter++;
      if (this.matchCounter === 14) {
        this.dataService.addRecord({
          player: this.player,
          minutes: this.minutes,
          seconds: this.seconds,
          date: new Date(),
        });
        clearInterval(this.intervalId);
        setTimeout(() => {
          this.success = true;
        }, 1200);
      }
      this.activeAnimation = false;
      this.firstFlipped = null;
    } else {
      setTimeout(() => {
        this.firstFlipped!.isFlipped = album.isFlipped = false;
        this.activeAnimation = false;
        this.firstFlipped = null;
      }, 1200);
    }
  }

  protected adjustZIndex(event: TransitionEvent): void {
    if (event.propertyName === 'transform') {
      const albumElement = event.currentTarget as HTMLDivElement;
      albumElement.style.zIndex = '1';
      setTimeout(() => {
        albumElement.style.zIndex = '0';
      }, 900);
    }
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => (this.isMainPage = this.router.url === '/'));
  }
}
