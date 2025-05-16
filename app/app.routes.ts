import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'cadastro-usuario',
    loadComponent: () => import('./cadastro-user/cadastro-user.page').then(m => m.CadastroUserPage),
  },
  {
    path: 'notificacao',
    loadComponent: () => import('./notificacao/notificacao.page').then(m => m.NotificacaoPage),
}
];