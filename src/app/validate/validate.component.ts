import { Component, OnInit } from "@angular/core";
import { VerifactionService } from "../verifaction.service";
import { saveAs } from "file-saver/FileSaver";
import { Subscription } from "rxjs/Subscription";
// tslint:disable-next-line:import-blacklist
import { Observable } from "rxjs/Rx";

@Component({
  selector: "app-validate",
  templateUrl: "./validate.component.html",
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
  size = 35;
  threads: string[];
  sent: number;
  total: number;
  failed: string[];
  failedValue: string;

  // time
  ticks = 0;
  minutesDisplay = 0;
  hoursDisplay = 0;
  secondsDisplay = 0;

  sub: Subscription;

  constructor(private service: VerifactionService) {
    this.input = "";
    this.reset();
    this.loading = false;
    this.initialEmails = [];
    this.threads = [];
    this.sent = 0;
    this.total = 0;
    this.failed = [];
    this.failedValue = "";
  }

  ngOnInit() {}

  getPercentSent() {
    return this.sent > 0
      ? `${Math.floor((this.sent / this.total) * 100)}%`
      : "0%";
  }

  startTime() {
    const timer = Observable.timer(1, 1000);
    this.sub = timer.subscribe(t => {
      this.ticks = t;

      this.secondsDisplay = this.getSeconds(this.ticks);
      this.minutesDisplay = this.getMinutes(this.ticks);
      this.hoursDisplay = this.getHours(this.ticks);
      this.formatTime();
    });
  }

  stopTime() {
    this.sub.unsubscribe();
  }

  resetTime() {
    this.ticks = 0;
    this.minutesDisplay = 0;
    this.hoursDisplay = 0;
    this.secondsDisplay = 0;
    this.formatTime();
  }
  // remove
  formatTime(): string {
    // TODO
    return `${this.hoursDisplay ? this.hoursDisplay : "00"} : ${
      this.minutesDisplay && this.minutesDisplay <= 59
        ? this.minutesDisplay
        : "00"
    }   :  ${
      this.secondsDisplay && this.secondsDisplay <= 59
        ? this.secondsDisplay
        : "00"
    }`;
  }

  beginValidation() {
    this.loading = true;
    this.startTime();
    this.reset();
    this.threads = this.initialEmails;
    this.divideRequest();
  }

  // parpare request
  divideRequest() {
    if (this.total !== this.sent) {
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
      this.loading = false;
      this.stopTime();
      // this.CancelRequest();
    }
  }
  onChange() {
    if (this.input) {
      // filter
      const filter = this.input
        .split(",")
        .filter(item => item !== null)
        .map(item => {
          item = item.trim();
          let items = item.endsWith(".") ? item.slice(0, -1) : item.trim();
          items = items.endsWith("-") ? items.slice(0, -1) : items.trim();
          return items;
        })
        .filter(email => email.split("@").length > 1);
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
    this.valid = "";
    this.invalid = "";
    this.validValue = [];
    this.invalidateValue = [];
    this.loading = false;
    this.sent = 0;
    this.failedValue = "";
    this.failed = [];
    this.resetTime();
  }

  makeRequest(email: string) {
    this.loading = true;
    this.service.verifyEmail(email).subscribe(
      doc => {
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
        this.getPercentSent();

        if (this.count === this.size && this.sent !== this.total) {
          this.count = 0;
          this.divideRequest();
        }
        // this.pregressing();
        if (this.sent === this.total) {
          this.loading = false;
          setTimeout(() => {
            alert("Email verfication completed: " + this.sent);
          }, 100);
          this.threads = [];
          this.stopTime();
        }
      },
      () => {
        // error
        this.failed.push(email);
        this.failedValue = this.emailToString(this.failed);
        this.sent++;
        this.count++;
        this.getPercentSent();
        if (this.count === this.size && this.sent !== this.total) {
          this.count = 0;
          this.divideRequest();
        }
        if (this.sent === this.total) {
          this.loading = false;
          this.stopTime();
          setTimeout(() => {
            alert(
              "Failed! An error ocurred, please check you internet connection and try again"
            );
          }, 100);
        }
        // this.pregressing();
      },
      () => {
        // completed
      }
    );
  }

  // convert list of email to csv
  emailToString(emails: string[]) {
    return emails
      .map(item => {
        return item.trim();
      })
      .join(",");
  }

  CancelRequest() {
    if (confirm("Cancel all active request?")) {
      this.loading = false;
      this.sent = this.total;
      this.stopTime();
    }
  }
  saveFile() {
    // build saveAs dialog box
    const filename = `valid-email${this.validValue.length}.csv`;
    const blob = new Blob([this.valid], { type: "text/csv;charset=utf-8" });
    saveAs(blob, filename);
  }

  private getSeconds(ticks: number) {
    return this.pad(ticks % 60);
  }

  private getMinutes(ticks: number) {
    return this.pad(Math.floor(ticks / 60) % 60);
  }

  private getHours(ticks: number) {
    return this.pad(Math.floor(ticks / 60 / 60));
  }

  private pad(digit: any) {
    return digit <= 9 ? "0" + digit : digit;
  }
}
