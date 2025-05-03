import { Routes } from '@angular/router';

import { RecordsComponent } from './records/records.component';
import { PlayersComponent } from './players/players.component';

export const routes: Routes = [
  { path: 'records', component: RecordsComponent },
  { path: 'players', component: PlayersComponent },
  { path: '**', redirectTo: '' },
];
