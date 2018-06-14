import { Component, OnInit } from '@angular/core';
import { KeyValue } from '../model/result.model';

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
  grouping: boolean;
  grouped: KeyValue[];

  constructor() {
    this.content = '';
    this.initialEmails = [];
    this.loading = false;
    this.resultString = '';
    this.filteredEmails = [];
    this.repeatedEmails = [];
    this.grouping = false;
    this.grouped = [];

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
    this.loading = true;
    this.filteredEmails = [];
    this.grouped = [];
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
    this.loading = false;
  }

  // check if email has been added to the list
  hasBeenAdded(email: string): boolean {
    return this.filteredEmails.indexOf(email) === -1;
  }
  // convert list of email to csv
  emailToString(emails: string[]) {
    return emails.map(item => {
      return item.trim();
    }).join(',');
  }

  cleanGroup() {
    this.grouping = true;
    const groups = Object.create(null),
      grouped = [];

    this.filteredEmails.forEach(function (o) {
      const domain = o.split('@')[1];
      if (!groups[domain]) {
        groups[domain] = [];
        grouped.push({ domain: domain, emails: groups[domain] });
      }
      groups[domain].push(o);
    });
    this.grouped = grouped;
    this.grouping = false;
  }
}
