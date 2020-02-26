import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';
import {MyAppsComponent} from './my-apps/my-apps.component'
import {MyExceptionsComponent} from './my-exceptions/my-exceptions.component'

const routes: Routes = [
  {path:'my-apps', component: MyAppsComponent},
  {path:'new-app-questionnaire', component: QuestionnaireComponent},
  {path:'my-exceptions', component: MyExceptionsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
