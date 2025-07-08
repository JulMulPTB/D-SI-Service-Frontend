import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DkeycomparisonComponent } from './dkeycomparison.component';

describe('DkeycomparisonComponent', () => {
  let component: DkeycomparisonComponent;
  let fixture: ComponentFixture<DkeycomparisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DkeycomparisonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DkeycomparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
