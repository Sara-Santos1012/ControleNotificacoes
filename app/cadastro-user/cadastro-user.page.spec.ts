import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CadastroUserPage } from './cadastro-user.page';

describe('CadastroUsuarioPage', () => {
  let component: CadastroUserPage;
  let fixture: ComponentFixture<CadastroUserPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CadastroUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
