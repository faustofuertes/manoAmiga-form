import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Publicacion } from '../../interfaces/publicacion';
import { PublicacionesService } from '../../services/publicaciones.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from '../../interfaces/usuario';
import { UsuariosService } from '../../services/usuarios.service';
import { AuthService } from '@auth0/auth0-angular';
import { MyToken } from '../../interfaces/my-token';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-form-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-page.component.html',
  styleUrl: './form-page.component.css'
})
export class FormPageComponent {
  jobs: string[] = ['Electricista', 'Plomero', 'Jardinero', 'Pintor', 'Cerrajero', 'Tecnico', 'Carpintero', 'Limpieza'];
  locations: string[] = ['Mar del Plata'];

  usuario?: Usuario;

  currentStep = 1;

  isLoading = true;
  isSubmitting = false;


  step1Form: FormGroup;
  step2Form: FormGroup;
  step3Form: FormGroup;
  step4Form: FormGroup;
  step5Form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _myPubliService: PublicacionesService,
    private _router: Router,
    public _auth: AuthService,
    private _myUsuService: UsuariosService
  ) {
    this.step1Form = this.fb.group({
      job: ['', Validators.required],
      location: ['', Validators.required]
    });

    this.step2Form = this.fb.group({
      description: [
        '',
        [
          Validators.required,
          (control: AbstractControl) => {
            const value = control.value || '';
            const words = value
              .trim()
              .split(/\s+/)
              .filter((word: string) => word.length > 0);
            return words.length >= 20 ? null : { minWords: true };
          }
        ]
      ]
    });

    this.step3Form = this.fb.group({
      pricing: ['', Validators.required]
    });

    this.step4Form = this.fb.group({
      schedule: ['', Validators.required],
      experience: ['', Validators.required]
    });

    this.step5Form = this.fb.group({
      phone: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this._auth.idTokenClaims$.subscribe(claims => {
      const token = claims?.__raw;

      if (token) {
        const decoded = jwtDecode<MyToken>(token);

        this._myUsuService.getUsuarioXId(decoded.sub).subscribe(data => {
          this.usuario = data;

          if (this.usuario && this.usuario._id && this.usuario.name) {
            this._router.navigate(['/ya-registrado']);
          }

          this.isLoading = false;
        }, error => {
          console.log('No existe ese usuario.');

          this.usuario = {
            auth0Id: decoded.sub,
            name: decoded.name,
            email: decoded.email
          };

          this._myUsuService.postUsuario(this.usuario).subscribe(data => {
            if (data && data._id && data.name) {
              localStorage.setItem('userID', data._id);
              localStorage.setItem('userName', data.name);
            }

            this.isLoading = false;
          });
        });
      } else {
        this.isLoading = false;
      }
    });
  }

  nextStep() {
    if (this.currentStep < 5) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onSubmit() {
    this.isSubmitting = true;
    if (this.step1Form.valid && this.step2Form.valid) {

      const publicacion: Publicacion = {
        userId: localStorage.getItem('userID'),
        userName: localStorage.getItem('userName'),
        job: this.step1Form.value.job,
        location: this.step1Form.value.location,
        description: this.step2Form.value.description,
        schedule: this.step4Form.value.schedule,
        pricing: this.step3Form.value.pricing,
        experience: this.step4Form.value.experience,
        phone: this.step5Form.value.phone
      };

      this._myPubliService.postPublicacion(publicacion).subscribe(() => {
        this._router.navigate(['/registrado-correctamente']);
        this.isSubmitting = false;
      });
    }
  }
}
