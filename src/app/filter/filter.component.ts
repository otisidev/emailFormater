import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styles: []
})
export class FilterComponent implements OnInit {

  emailToFilter: string;
  filter: string;
  cleanedEmail: string[];
  filtering: boolean;
  cleanedEmailString: string;
  oriArray: string[];

  constructor() {

    this.emailToFilter = '';
    this.filter = '';
    this.cleanedEmail = [];
    this.filtering = false;
    this.cleanedEmailString = '';
    this.oriArray = [];
  }

  ngOnInit() {
  }
  filterSecondEmail() {
    // init new string array
    // covert string to string array
    if (this.emailToFilter) {
      // filter
      const efilter = this.emailToFilter
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
      if (efilter) {
        this.oriArray = efilter;
      } else {
        this.oriArray = [];
      }
    }
    // convert the filter to string array
    const filter = this.filter.trim().split(',');
    // call function that would do the filtering
    this.funcFilter(this.oriArray, filter);
    // convert the result back to string
    this.cleanedEmailString = this.emailToString(this.cleanedEmail);
  }

  funcFilter(orginalArray: string[], filterData: string[]) {
    this.filtering = true;
    this.cleanedEmail = orginalArray.filter(f => {
      // domain here
      const d = f.split('@')[1];
      // console.log(f + ' - ' + this.contains(filterData, f));
      return !filterData.includes(d);
    });
    this.filtering = false;
  }

  contains(items: string[], domain: string) {
    const matches = items.filter(function (item) {
      if (item) {
        return item.indexOf(domain) !== -1;
      }
    });
    return matches.length > 0;
  }
  // convert list of email to csv
  emailToString(emails: string[]) {
    return emails.map(item => {
      return item.trim();
    }).join(',');
  }
}
