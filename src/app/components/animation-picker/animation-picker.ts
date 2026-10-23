import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  AnimationConfig,
  AnimationType,
} from '../../models/portfolio.model';
import { ANIMATION_OPTIONS } from '../../models/animations.data';

@Component({
  imports: [],
  selector: 'app-animation-picker',
  styleUrl: './animation-picker.css',
  templateUrl: './animation-picker.html',
})
export class AnimationPicker {
  @Input() config: AnimationConfig = {
    entrance: 'none',
    hover: 'none',
    duration: 1,
    delay: 0,
  };
  @Output() configChange = new EventEmitter<AnimationConfig>();

  protected readonly animationOptions = ANIMATION_OPTIONS;

  protected updateEntrance(event: Event): void {
    const entrance = (event.target as HTMLSelectElement).value;
    if (this.isAnimationType(entrance)) {
      this.emitConfigChange({ entrance });
    }
  }

  protected updateDuration(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const duration = Number(value);
    if (value !== '' && Number.isFinite(duration) && duration >= 0) {
      this.emitConfigChange({ duration });
    }
  }

  protected updateDelay(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const delay = Number(value);
    if (value !== '' && Number.isFinite(delay) && delay >= 0) {
      this.emitConfigChange({ delay });
    }
  }

  private isAnimationType(value: string): value is AnimationType {
    return this.animationOptions.some((option) => option.value === value);
  }

  private emitConfigChange(changes: Partial<AnimationConfig>): void {
    this.configChange.emit({ ...this.config, ...changes });
  }
}
