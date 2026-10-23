import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnimationConfig } from '../../models/portfolio.model';
import { AnimationPicker } from './animation-picker';

describe('AnimationPicker', () => {
  let component: AnimationPicker;
  let fixture: ComponentFixture<AnimationPicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimationPicker],
    }).compileComponents();

    fixture = TestBed.createComponent(AnimationPicker);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emits the updated configuration when the entrance animation changes', () => {
    const config: AnimationConfig = {
      entrance: 'none',
      hover: 'pulse',
      duration: 1.5,
      delay: 0.2,
    };
    fixture.componentRef.setInput('config', config);
    fixture.detectChanges();

    let emittedConfig: AnimationConfig | undefined;
    component.configChange.subscribe((value) => {
      emittedConfig = value;
    });

    const select = fixture.nativeElement.querySelector(
      '#entrance-animation',
    ) as HTMLSelectElement;
    select.value = 'fadeIn';
    select.dispatchEvent(new Event('change'));

    expect(emittedConfig).toEqual({
      ...config,
      entrance: 'fadeIn',
    });
  });
});
