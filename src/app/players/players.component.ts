import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrl: './players.component.scss',
  imports: [],
})
export class PlayersComponent {
  constructor(private router: Router) {}

  protected goMainPage(): void {
    this.router.navigate(['/']);
  }
}
