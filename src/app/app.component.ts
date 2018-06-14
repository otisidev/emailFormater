import { ResultModel } from './../model/result.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent implements OnInit {

  content: string;
  loading: boolean;
  resultString: string;
  initialEmails: string[];
  filteredEmails: string[];
  repeatedEmails: string[];
  constructor() {
    this.content = '';
    this.initialEmails = [];
    this.loading = false;
    this.resultString = '';
    this.filteredEmails = [];
    this.repeatedEmails = [];


  }

  ngOnInit() {
  }

  onChange() {
    if (this.content) {
      // filter
      const filter = this.content
        .split(',')
        .filter(item => item !== null)
        .map(item => {
          return item.endsWith('.') ? item.slice(0, -1) : item.trim();
        });
      // check for null before assigning new value
      if (filter) {
        this.initialEmails = filter;
      } else {
        this.initialEmails = [];
      }
    }
  }

  filterEmail() {
    this.filteredEmails = [];
    this.repeatedEmails = [];
    this.resultString = '';
    this.onChange();
    this.initialEmails.forEach(email => {
      if (this.hasBeenAdded(email)) {
        this.filteredEmails.push(email);
      } else {
        this.repeatedEmails.push(email);
      }
    });
    this.resultString = this.filteredEmails.map(item => {
      return item.trim();
    }).join(',');
  }

  // check if email has been added to the list
  hasBeenAdded(email: string): boolean {
    return this.filteredEmails.indexOf(email) === -1;
  }
}
