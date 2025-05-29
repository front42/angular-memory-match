import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { DecimalPipe, NgIf } from '@angular/common';
import { filter } from 'rxjs';

class Album {
  constructor(public front: string, public back: string, public isFlipped: boolean) {}
}

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
  protected albumsInOrder: Album[] = [];
  protected albums: Album[] = [];
  protected minutes: number = 0;
  protected seconds: number = 0;
  protected intervalId: any;

  constructor(private router: Router) {
    for (let i = 0; i < 14; i++) {
      this.albumsInOrder.push(
        new Album(`url(assets/album-${i < 10 ? '0' + i : i}.jpg)`, 'url(assets/vinyl-lp.png)', true),
        new Album(`url(assets/album-${i < 10 ? '0' + i : i}.jpg)`, 'url(assets/vinyl-lp.png)', true)
      );
    }
    this.albums = this.albumsInOrder.slice();
  }

  protected flipAlbum(index: number, event: MouseEvent): void {
    const album = event.currentTarget as HTMLDivElement;
    album.style.zIndex = '1';
    setTimeout(() => {
      album.style.zIndex = '0';
    }, 1000);
    this.albums[index].isFlipped = !this.albums[index].isFlipped;
  }

  protected order() {
    this.albums = this.albumsInOrder.slice();
  }

  protected shuffle(array: Album[]): Album[] {
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
    setTimeout(() => this.albums.forEach((album) => (album.isFlipped = false)), 5000);
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
    setTimeout(() => this.albums.forEach((album) => (album.isFlipped = false)));
    setTimeout(() => {
      this.order();
      this.albums.forEach((album) => (album.isFlipped = true));
    }, 1000);
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => (this.isMainPage = this.router.url === '/'));
  }
}
