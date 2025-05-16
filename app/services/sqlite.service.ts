import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
  CapacitorSQLitePlugin,
  capSQLiteUpgradeOptions,
} from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root',
})
export class SQLiteService {
  sqliteConnection!: SQLiteConnection;
  isService = false;
  platform!: string;
  sqlitePlugin!: CapacitorSQLitePlugin;
  native = false;
  db!: SQLiteDBConnection;

  constructor() {}

  async initializePlugin(): Promise<boolean> {
    this.platform = Capacitor.getPlatform();
    if (this.platform === 'ios' || this.platform === 'android')
      this.native = true;
    this.sqlitePlugin = CapacitorSQLite;
    this.sqliteConnection = new SQLiteConnection(this.sqlitePlugin);
    this.isService = true;
    return true;
  }

  async initWebStore(): Promise<void> {
    try {
      await this.sqliteConnection.initWebStore();
    } catch (err: any) {
      const msg = err.message ? err.message : err;
      return Promise.reject(`initWebStore: ${msg}`);
    }
  }

  async openDatabase(
    dbName: string,
    encrypted: boolean,
    mode: string,
    version: number,
    readonly: boolean
  ): Promise<SQLiteDBConnection> {
    const retCC = (await this.sqliteConnection.checkConnectionsConsistency())
      .result;
    const isConn = (await this.sqliteConnection.isConnection(dbName, readonly))
      .result;

    if (retCC && isConn) {
      this.db = await this.sqliteConnection.retrieveConnection(
        dbName,
        readonly
      );
    } else {
      this.db = await this.sqliteConnection.createConnection(
        dbName,
        encrypted,
        mode,
        version,
        readonly
      );
    }

    await this.db.open();
    await this.db.execute('PRAGMA foreign_keys = ON;');
    return this.db;
  }

  async retrieveConnection(
    dbName: string,
    readonly: boolean
  ): Promise<SQLiteDBConnection> {
    return await this.sqliteConnection.retrieveConnection(dbName, readonly);
  }

  async closeConnection(database: string, readonly = false): Promise<void> {
    return await this.sqliteConnection.closeConnection(database, readonly);
  }

  async addUpgradeStatement(options: capSQLiteUpgradeOptions): Promise<void> {
    await this.sqlitePlugin.addUpgradeStatement(options);
  }

  async saveToStore(database: string): Promise<void> {
    return await this.sqliteConnection.saveToStore(database);
  }

  async createTables(): Promise<void> {
    const db = this.db;

    await db.execute(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        senha TEXT NOT NULL
      );
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS notificacoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      mensagem TEXT NOT NULL,
      data TEXT NOT NULL
      );
    `);
    try {
      await db.execute(
        'ALTER TABLE notificacoes ADD COLUMN lida INTEGER NOT NULL DEFAULT 0;'
      );
    } catch (e) {}
  }

  getDB(): SQLiteDBConnection {
    return this.db;
  }
}
