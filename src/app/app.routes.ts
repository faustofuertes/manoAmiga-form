import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { FormPageComponent } from './pages/form-page/form-page.component';
import { SuccesfulRegisteredComponent } from './pages/succesful-registered/succesful-registered.component';
import { AlreadyRegisteredComponent } from './pages/already-registered/already-registered.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'formulario', component: FormPageComponent },
    { path: 'registrado-correctamente', component: SuccesfulRegisteredComponent },
    { path: 'ya-registrado', component: AlreadyRegisteredComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
