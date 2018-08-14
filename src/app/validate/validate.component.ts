import { Component, OnInit } from '@angular/core';
import { VerifactionService } from '../verifaction.service';

@Component({
  selector: 'app-validate',
  templateUrl: './validate.component.html',
  styles: []
})
export class ValidateComponent implements OnInit {

  valid: string;
  invalid: string;
  input: string;
  validValue: string[];
  invalidateValue: string[];
  loading: boolean;
  initialEmails: string[];
  count = 0;
  size = 10;
  threads: string[];
  sent: number;
  total: number;
  failed: string[];
  failedValue: string;

  constructor(private service: VerifactionService) {
    this.input = '';
    this.reset();
    this.loading = false;
    this.initialEmails = [];
    this.threads = [];
    this.sent = 0;
    this.total = 0;
    this.failed = [];
    this.failedValue = '';
  }

  ngOnInit() {
  }
  beginValidation() {
    this.loading = true;
    this.reset();
    this.threads = this.initialEmails;
    // allocate job to 4 different threads
    // check if total email is greater than 3
    this.divideRequest();
  }

  // parpare request
  divideRequest() {
    if (this.initialEmails.length !== this.sent) {

      if (this.threads.length > this.size) {
        const batch = this.threads.splice(0, this.size);
        batch.forEach(d => this.makeRequest(d));
      } else {
        //  send all at once
        this.threads.forEach(email => {
          this.makeRequest(email);
        });

      }
    } else {
      alert('Email verfication completed: ' + this.sent);

    }
  }
  onChange() {
    if (this.input) {
      // filter
      const filter = this.input
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
        this.total = this.initialEmails.length;
      } else {
        this.initialEmails = [];
        this.total = 0;
      }
    }
  }

  reset() {
    this.valid = '';
    this.invalid = '';
    this.validValue = [];
    this.invalidateValue = [];
    this.loading = false;
  }


  makeRequest(email: string) {
    this.loading = true;
    this.service.verifyEmail(email)
      .subscribe(doc => {
        // success

        if (doc.status === 200) {
          // done
          if (doc.data.wellFormed && doc.data.validDomain) {

            if (doc.data.validMailbox !== null) {


              if (doc.data.validMailbox) {
                this.validValue.push(email);
                this.valid = this.emailToString(this.validValue);
              } else {
                this.invalidateValue.push(email);
                this.invalid = this.emailToString(this.invalidateValue);
              }
            } else {
              this.validValue.push(email);
              this.valid = this.emailToString(this.validValue);
            }
          } else {
            // failed
            this.invalidateValue.push(email);
            this.invalid = this.emailToString(this.invalidateValue);
          }
        } else {
          this.invalidateValue.push(email);
          this.invalid = this.emailToString(this.invalidateValue);
        }
        // check status
        this.sent++;
        this.count++;
        if (this.count === this.size) {
          this.count = 0;
          this.divideRequest();
        }

        if (this.sent === this.total) {
          this.loading = false;
          alert('Email verfication completed: ' + this.sent);
          this.threads = [];
        }
      }, () => {
        // error
        this.failed.push(email);
        this.failedValue = this.emailToString(this.failed);
        this.sent++;
        if (this.sent === this.total) {
          this.loading = false;
          alert('Failed! An error ocurred, please check you internet connection and try again');
        }
      }, () => {
        // completed
      });
  }

  // convert list of email to csv
  emailToString(emails: string[]) {
    return emails.map(item => {
      return item.trim();
    }).join(',');
  }
}
