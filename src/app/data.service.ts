import { Injectable } from '@angular/core';

export interface IRecord {
  player: string;
  minutes: number;
  seconds: number;
  date: Date;
}

@Injectable({ providedIn: 'root' })
export class DataService {
  public defaultPlayers: string[] = ['Slow-Man', 'Mr. Fast', 'm.i.d.', 'Someone else', 'speedy'];
  public defaultRecords: IRecord[] = [
    { player: 'speedy', minutes: 1, seconds: 46, date: new Date(2025, 4, 5, 12, 11) },
    { player: 'Mr. Fast', minutes: 2, seconds: 12, date: new Date(2025, 4, 2, 17, 38) },
    { player: 'm.i.d.', minutes: 3, seconds: 5, date: new Date(2025, 3, 18, 21, 11) },
    { player: 'Slow-Man', minutes: 7, seconds: 12, date: new Date(2025, 0, 1, 1, 37) },
    { player: 'Someone else', minutes: 44, seconds: 22, date: new Date(2025, 2, 11, 21, 42) },
  ];

  constructor() {}

  public updateSelectedPlayer(player: string): void {
    localStorage.setItem('selectedPlayer', player);
  }

  public getSelectedPlayer(): string {
    return localStorage.getItem('selectedPlayer') || 'Guest';
  }

  public updatePlayers(players: string[]): void {
    localStorage.setItem('players', JSON.stringify(players));
  }

  public getPlayers(): string[] {
    return JSON.parse(localStorage.getItem('players') as string) || this.defaultPlayers.slice();
  }

  public addPlayer(player: string): void {
    const players = this.getPlayers();
    players.unshift(player);
    this.updatePlayers(players);
    this.updateSelectedPlayer(player);
  }

  public updateRecords(records: IRecord[]): void {
    localStorage.setItem('records', JSON.stringify(records));
  }

  public getRecords(): IRecord[] {
    return JSON.parse(localStorage.getItem('records') as string) || this.defaultRecords.slice();
  }

  public addRecord(record: IRecord): void {
    const records = this.getRecords();
    records.push(record);
    records.sort((a: IRecord, b: IRecord) => a.minutes * 60 + a.seconds - (b.minutes * 60 + b.seconds));
    this.updateRecords(records);
  }

  public reset(key: string): void {
    if (key === 'players') localStorage.removeItem('selectedPlayer');
    localStorage.removeItem(key);
  }
}
