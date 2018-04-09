import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditComponent } from "./edit/edit.component";
import { LoginComponent } from "./login/login.component";
import { ShareComponent } from "./share/shared.component";
import { ViewComponent } from "./view/view.component";


const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'share/:id', component: ShareComponent},
  {path: 'view/:id', component: ViewComponent},
  {path: 'edit', component: EditComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}