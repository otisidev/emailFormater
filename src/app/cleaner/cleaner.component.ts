import { Component, OnInit } from '@angular/core';
import { KeyValue } from '../../model/result.model';
import { saveAs } from 'file-saver/FileSaver';

@Component({
  selector: 'app-cleaner',
  templateUrl: './cleaner.component.html',
  styles: [
    `
    .float {
      	position:fixed;
      	width:60px;
      	height:60px;
      	bottom:40px;
      	right:40px;
}
    `
  ]
})
export class CleanerComponent implements OnInit {
  content: string;
  loading: boolean;
  resultString: string;
  initialEmails: string[];
  filteredEmails: string[];
  repeatedEmails: string[];
  grouping: boolean;
  grouped: KeyValue[];
  gResult: string;
  hGroup: KeyValue[];

  constructor() {
    this.content = '';
    this.initialEmails = [];
    this.loading = false;
    this.resultString = '';
    this.filteredEmails = [];
    this.repeatedEmails = [];
    this.grouping = false;
    this.grouped = [];
    this.gResult = '';
    this.hGroup = [];
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
          item = item.trim();
          let items = item.endsWith('.') ? item.slice(0, -1) : item.trim();
          items = items.endsWith('-') ? items.slice(0, -1) : items.trim();
          return items;
        })
        .filter(email => email.split('@').length > 1);
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
    this.hGroup = this.grouped.filter(c => c.emails.length > 10);
    this.addToGeneral();
  }

  addToGeneral() {
    // get all small email
    const data = this.grouped
      .filter(c => c.emails.length <= 10);

    data.forEach(cb => {
      this.gResult += this.emailToString(cb.emails) + ',';
    });

  }

  // saveAs
  saveFileAs(domain: string, index?: number) {
    let content = null;
    if (index !== -1) {
      content = this.emailToString(this.hGroup[index].emails);
    } else {
      content = this.gResult;
    }

    // build saveAs dialog box
    const filename = `${domain}.csv`;
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, filename);
  }

  openNewTab() {
    alert('Feature coming soon!');
  }

  refresh() {
    const state = confirm('Clear application result?');
    if (state) {
      this.content = '';
      this.initialEmails = [];
      this.loading = false;
      this.resultString = '';
      this.filteredEmails = [];
      this.repeatedEmails = [];
      this.grouping = false;
      this.grouped = [];
      this.gResult = '';
      this.hGroup = [];
    }
  }
}
