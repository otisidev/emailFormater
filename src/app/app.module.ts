import { HttpClientModule } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { AppComponent } from "./app.component";
import { CleanerComponent } from "./cleaner/cleaner.component";
import { FilterComponent } from "./filter/filter.component";
import { ValidateComponent } from "./validate/validate.component";
import { VerifactionService } from "./verifaction.service";

const routes: Routes = [
  { path: "", redirectTo: "cleaner", pathMatch: "full" },
  { component: FilterComponent, path: "filter" },
  { component: ValidateComponent, path: "validate" },
  { component: CleanerComponent, path: "cleaner" }
];

@NgModule({
  declarations: [
    AppComponent,
    CleanerComponent,
    FilterComponent,
    ValidateComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
    HttpClientModule
  ],
  providers: [VerifactionService],
  bootstrap: [AppComponent]
})
export class AppModule {}
