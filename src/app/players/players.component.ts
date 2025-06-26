import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DataService } from '../data.service';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrl: './players.component.scss',
  imports: [],
})
export class PlayersComponent implements OnInit {
  protected selectedPlayer: string = '';
  protected players: string[] = [];

  constructor(private router: Router, private dataService: DataService) {}

  protected goMainPage(): void {
    this.router.navigate(['/']);
  }

  protected selectPlayer(input: HTMLInputElement, player: string): void {
    input.value = player;
    this.selectedPlayer = player;
    this.dataService.updateSelectedPlayer(player);
  }

  protected addPlayer(player: string): void {
    if (this.players.includes(player)) return;
    this.selectedPlayer = player;
    this.dataService.addPlayer(player);
    this.players = this.dataService.getPlayers();
  }

  protected resetPlayers(input: HTMLInputElement) {
    input.value = '';
    this.dataService.reset('players');
    this.players = this.dataService.getPlayers();
    this.selectedPlayer = this.dataService.getSelectedPlayer();
  }

  ngOnInit(): void {
    this.players = this.dataService.getPlayers();
    this.selectedPlayer = this.dataService.getSelectedPlayer();
  }
}
