// Com jeitinho didatico, este mapa liga cada caminho da URL ao componente correto.
import { Routes } from "@angular/router";
import { LoginComponent } from "./pages/login/login.component";
import { RegisterComponent } from "./pages/register/register.component";
import { TasksComponent } from "./pages/tasks/tasks.component";

export const routes: Routes = [
  { path: "", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "tasks", component: TasksComponent },
  { path: "**", redirectTo: "" },
];
