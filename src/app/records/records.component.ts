import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrl: './records.component.scss',
  imports: [],
})
export class RecordsComponent {
  constructor(private router: Router) {}

  protected goMainPage(): void {
    this.router.navigate(['/']);
  }
}
