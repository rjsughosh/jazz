import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceDetailComponentOss } from './service-detail.component';

describe('ServiceDetailComponentOss', () => {
  let component: ServiceDetailComponentOss;
  let fixture: ComponentFixture<ServiceDetailComponentOss>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceDetailComponentOss ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceDetailComponentOss);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
