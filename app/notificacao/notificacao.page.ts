import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { SQLiteService } from '../services/sqlite.service';

@Component({
  selector: 'app-notificacao',
  templateUrl: './notificacao.page.html',
  styleUrls: ['./notificacao.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class NotificacaoPage implements OnInit {
  titulo = '';
  mensagem = '';
  notificacoes: any[] = [];

  constructor(
    private sqliteService: SQLiteService,
    private toastCtrl: ToastController
  ) {}

  async ngOnInit() {
    await this.carregarNotificacoes();
  }

  async adicionarNotificacao() {
    if (!this.titulo || !this.mensagem) {
      this.mostrarToast('Preencha todos os campos.');
      return;
    }

    const db = this.sqliteService.getDB();
    const dataAtual = new Date().toISOString();

    await db.run(
      'INSERT INTO notificacoes (titulo, mensagem, data, lida) VALUES (?, ?, ?, 0)',
      [this.titulo, this.mensagem, dataAtual]
    );

    this.titulo = '';
    this.mensagem = '';

    await this.carregarNotificacoes();
    this.mostrarToast('Notificação adicionada!');
  }

  async carregarNotificacoes() {
    const db = this.sqliteService.getDB();
    const result = await db.query(
      'SELECT * FROM notificacoes ORDER BY lida ASC, id DESC'
    );
    this.notificacoes = result.values ?? [];
  }

  async mostrarToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }
  async apagarTodasNotificacoes() {
    const db = this.sqliteService.getDB();
    await db.run('DELETE FROM notificacoes');
    this.mostrarToast('Todas as notificações foram apagadas.');
    await this.carregarNotificacoes();
  }
  async marcarComoLido(id: number) {
    const db = this.sqliteService.getDB();
    await db.run('UPDATE notificacoes SET lida = 1 WHERE id = ?', [id]);
    await this.carregarNotificacoes();
    this.mostrarToast('Notificação marcada como lida');
  }
}
