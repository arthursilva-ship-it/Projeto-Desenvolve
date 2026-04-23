// Com visual carinhoso, este componente renderiza uma tarefa com status e acao de remover.
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { Task } from '../../services/api.service';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatChipsModule,
  ],
  template: `
    <mat-card appearance="outlined">
      <mat-card-content style="display:flex; align-items:center; gap:12px; padding:12px 16px">
        <mat-icon color="primary">task_alt</mat-icon>

        <div style="flex:1; min-width:0">
          <strong style="display:block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap">
            {{ task.title }}
          </strong>
          <mat-chip-set>
            <mat-chip [highlighted]="task.status === 'concluida'" color="primary">
              {{ task.status || 'pendente' }}
            </mat-chip>
          </mat-chip-set>
        </div>

        <button
          mat-icon-button
          color="warn"
          (click)="remove.emit(task.title)"
          matTooltip="Remover tarefa"
        >
          <mat-icon>delete</mat-icon>
        </button>
      </mat-card-content>
    </mat-card>
  `,
})
export class TaskComponent {
  @Input() task!: Task;
  @Output() remove = new EventEmitter<string>();
}
