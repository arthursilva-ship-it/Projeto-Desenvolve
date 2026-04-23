import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiService, Task } from '../../services/api.service';
import { TaskComponent } from './task.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    TaskComponent,
  ],
  templateUrl: './tasks.component.html',
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  // Com carinho pelo aprendizado, este FormControl aplica validacao em tempo real.
  titleControl = new FormControl('', [Validators.required, Validators.minLength(2)]);
  loading = false;
  creating = false;

  constructor(
    private api: ApiService,
    private router: Router,
    private snack: MatSnackBar,
  ) {}

  ngOnInit(): void {
    // Com seguranca de sessao, redirecionamos quando nao existe token salvo.
    if (!localStorage.getItem('token')) {
      this.router.navigateByUrl('/');
      return;
    }
    // Com token valido, carregamos as tarefas da pessoa autenticada.
    this.load();
  }

  load(): void {
    this.loading = true;
    this.api.getTasks().subscribe({
      next: (res) => { this.tasks = res; },
      error: () => {
        this.snack.open('Ops! Nao conseguimos carregar as tarefas agora.', 'Ok', { duration: 4000 });
        this.loading = false;
      },
      complete: () => { this.loading = false; },
    });
  }

  add(): void {
    if (this.titleControl.invalid) {
      this.titleControl.markAsTouched();
      return;
    }

    this.creating = true;
    this.api.createTask({ title: this.titleControl.value! }).subscribe({
      next: () => {
        // Com feedback imediato, limpamos o campo e recarregamos a lista na tela.
        this.titleControl.reset();
        this.load();
      },
      error: () => {
        this.snack.open('Nao deu para criar essa tarefa agora. Vamos tentar de novo?', 'Claro', { duration: 4200 });
        this.creating = false;
      },
      complete: () => { this.creating = false; },
    });
  }

  delete(title: string): void {
    this.api.deleteTask(title).subscribe({
      next: () => this.load(),
      error: () => this.snack.open('Hmm... nao consegui remover essa tarefa agora.', 'Entendi', { duration: 4000 }),
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/');
  }
}
