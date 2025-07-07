import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

//Components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

//Modules 
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { HomeComponent } from './home/home.component';
import { DatePickerModule } from 'primeng/datepicker';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HttpClientModule } from '@angular/common/http';
import { PanelModule } from 'primeng/panel';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { InputNumberModule } from 'primeng/inputnumber';
import { ChartModule } from 'primeng/chart';

import { ChildComponent } from './child/child.component';
import { WebsiteComponent } from './website/website.component';
import { FormComponent } from './form/form.component';
import { AuthGuard } from './auth-guard.guard';
import { GraphComponent } from './graph/graph.component';
import { MinutesToHoursPipe } from './minutes-to-hours.pipe';
import { PopoverModule } from 'primeng/popover';
import { NotFoundComponent } from './not-found/not-found.component';
import { ChildgraphComponent } from './childgraph/childgraph.component';
import { HeaderComponent } from './header/header.component';

import { AppRoutingModule } from './app.routes';




@NgModule({
  declarations: [AppComponent,LoginComponent,HomeComponent,ChildComponent,WebsiteComponent,FormComponent,GraphComponent,MinutesToHoursPipe, ChildgraphComponent, HeaderComponent],
  bootstrap:[AppComponent],
  imports: [
    AppRoutingModule,
    CommonModule,
    BrowserModule,
    ButtonModule,
    FormsModule,
    CardModule,
    InputTextModule,
    DatePickerModule,
    FileUploadModule,
    ToastModule,
    HttpClientModule,
    PanelModule,
    ToggleSwitchModule,
    InputNumberModule,
    ChartModule,
    PopoverModule
  ],
  providers:[provideAnimationsAsync(),providePrimeNG({theme :{preset :Aura}}),MessageService],
  exports:[RouterModule,MinutesToHoursPipe]
})
export class AppModule { }
