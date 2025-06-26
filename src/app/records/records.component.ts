import { Component, OnInit } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';

import { DataService } from '../data.service';
import { IRecord } from '../data.service';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrl: './records.component.scss',
  imports: [DecimalPipe, DatePipe],
})
export class RecordsComponent implements OnInit {
  protected records: IRecord[] = [];

  constructor(private router: Router, private dataService: DataService) {}

  protected goMainPage(): void {
    this.router.navigate(['/']);
  }

  protected resetRecords(): void {
    this.dataService.reset('records');
    this.records = this.dataService.getRecords();
  }

  ngOnInit(): void {
    this.records = this.dataService.getRecords();
  }
}
