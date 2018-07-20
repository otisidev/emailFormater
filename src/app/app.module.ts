import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { CleanerComponent } from './cleaner/cleaner.component';
import { FilterComponent } from './filter/filter.component';

const routes: Routes = [
  { path: '', redirectTo: 'cleaner', pathMatch: 'full' },
  { component: FilterComponent, path: 'filter' },
  { component: CleanerComponent, path: 'cleaner' }
];

@NgModule({
  declarations: [
    AppComponent,
    CleanerComponent,
    FilterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
