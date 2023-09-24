import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditComponent } from "./edit/edit.component";
import { LoginComponent } from "./login/login.component";
import { ViewComponent } from "./view/view.component";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";


const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'share/:id', component: ViewComponent},
  {path: 'view/:id', component: ViewComponent},
  {path: 'edit', component: EditComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
  providers: [
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}}
  ]
})

export class AppRoutingModule {
}
