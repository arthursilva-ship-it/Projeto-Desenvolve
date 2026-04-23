// Com energia e carinho, este arquivo inicializa o Angular e sobe o AppComponent.
import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";
import { appConfig } from "./app/app.config";

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
