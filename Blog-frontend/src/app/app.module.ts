import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component'; 
import { BlogListComponent } from './blog-list/blog-list.component';

@NgModule({
  declarations: [], 
  imports: [
    BrowserModule,
    AppComponent,  
    BlogListComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
