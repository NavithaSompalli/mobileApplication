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
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HttpClientModule } from '@angular/common/http';
import { PanelModule } from 'primeng/panel';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { InputNumberModule } from 'primeng/inputnumber';
import { ChartModule } from 'primeng/chart';
import { ProgressBarModule } from 'primeng/progressbar';

import { ChildComponent } from './child/child.component';
import { FooterComponent } from './footer/footer.component';
import { FormComponent } from './form/form.component';
import { AuthGuard } from './auth-guard.guard';
import { GraphComponent } from './graph/graph.component';
import { MinutesToHoursPipe } from './minutes-to-hours.pipe';



// Routers link array 
 const routes: Routes = [
  {path:'', component:LoginComponent},
  {path:'home', component: HomeComponent,canActivate:[AuthGuard]},
  {path:'child', component: ChildComponent,canActivate:[AuthGuard]},
  {path:'video', component: FooterComponent,canActivate:[AuthGuard]},
  {path:'form', component:FormComponent,canActivate:[AuthGuard]}
 ]

@NgModule({
  declarations: [AppComponent,LoginComponent,HomeComponent,ChildComponent,FooterComponent,FormComponent,GraphComponent,MinutesToHoursPipe],
  bootstrap:[AppComponent],
  imports: [
    RouterModule.forRoot(routes),
    CommonModule,
    BrowserModule,
    ButtonModule,
    FormsModule,
    CardModule,
    InputTextModule,
    CheckboxModule,
    DatePickerModule,
    SelectModule,
    FileUploadModule,
    ToastModule,
    HttpClientModule,
    PanelModule,
    ToggleSwitchModule,
    InputNumberModule,
    ChartModule,
    ProgressBarModule
  ],
  providers:[provideAnimationsAsync(),providePrimeNG({theme :{preset :Aura}}),MessageService],
  exports:[RouterModule,MinutesToHoursPipe]
})
export class AppModule { }
