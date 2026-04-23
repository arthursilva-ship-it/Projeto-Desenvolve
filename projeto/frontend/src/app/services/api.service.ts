import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface LoginResponse {
  token: string;
}

export interface Task {
  title: string;
  description?: string;
  status?: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  // Com carinho na integracao, este e o endereco base usado para chamar o backend.
  private readonly url = 'http://127.0.0.1:8110';

  constructor(private http: HttpClient) {}

  // --- helpers ---

  /** Monta o header Authorization com o JWT armazenado. */
  private authHeader(): { headers: HttpHeaders } {
    // Com seguranca e amor, adicionamos o Bearer token para acessar rotas protegidas.
    const token = localStorage.getItem('token') ?? '';
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  // --- auth ---

  login(data: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.url}/login`, data);
  }

  register(data: { name: string; email: string; password: string }): Observable<{ msg: string }> {
    return this.http.post<{ msg: string }>(`${this.url}/register`, data);
  }

  // --- tasks ---

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.url}/tasks`, this.authHeader());
  }

  createTask(task: Pick<Task, 'title'>): Observable<{ msg: string }> {
    return this.http.post<{ msg: string }>(`${this.url}/tasks`, task, this.authHeader());
  }

  deleteTask(title: string): Observable<{ msg: string }> {
    return this.http.delete<{ msg: string }>(`${this.url}/tasks/${encodeURIComponent(title)}`, this.authHeader());
  }
}
