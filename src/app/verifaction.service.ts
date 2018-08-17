import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { SingleResponse } from "./single-response";

@Injectable()
export class VerifactionService {
  constructor(private http: HttpClient) {}

  verifyEmail(email: string) {
    return this.http.get<SingleResponse>(
      "https://rfq.verifycredential.com/api/email/check/" + email
    );
  }
}
