import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceDetailContainerComponent } from './service-detail-container.component';

describe('ServiceDetailContainerComponent', () => {
  let component: ServiceDetailContainerComponent;
  let fixture: ComponentFixture<ServiceDetailContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceDetailContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceDetailContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
