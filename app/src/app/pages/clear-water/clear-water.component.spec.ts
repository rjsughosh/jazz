import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearWaterComponent } from './clear-water.component';

describe('ClearWaterComponent', () => {
  let component: ClearWaterComponent;
  let fixture: ComponentFixture<ClearWaterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClearWaterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClearWaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
