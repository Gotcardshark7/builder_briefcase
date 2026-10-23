import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { Generator } from './services/generator';
import { PortfolioSection, State } from './services/state';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the portfolio builder', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Portfolio Builder');
  });

  it('adds a social icon from its thumbnail and exposes destination controls', async () => {
    const fixture = TestBed.createComponent(App);
    const state = TestBed.inject(State);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll<HTMLButtonElement>('.social-icon-option');
    expect(buttons).toHaveLength(7);
    expect(buttons[0].querySelector('svg')).toBeTruthy();
    buttons[0].click();
    fixture.detectChanges();

    expect(state.snapshot.socialLinks).toEqual([{ id: 'whatsapp', href: '', placement: 'hero' }]);
    expect(buttons[0].classList.contains('active')).toBe(true);
    expect(buttons[0].textContent).toContain('Activo');
    expect(compiled.querySelector('#social-whatsapp')?.getAttribute('placeholder')).toContain(
      'número',
    );
    expect(compiled.querySelector('#social-placement-whatsapp')).toBeTruthy();
  });

  it('selects a technology palette and applies it to the live preview', async () => {
    const fixture = TestBed.createComponent(App);
    const state = TestBed.inject(State);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const paletteButton = compiled.querySelector<HTMLButtonElement>(
      '[aria-label="React · Cyan Cyber"]',
    )!;
    paletteButton.click();
    fixture.detectChanges();

    expect(state.snapshot.theme.paletteId).toBe('tech-react');
    expect(state.snapshot.theme.primaryColor).toBe('#61DAFB');
    expect(state.snapshot.sections[0].colors.bgColor).toBe('#282c34');
    expect(paletteButton.getAttribute('aria-pressed')).toBe('true');
    expect(
      (compiled.querySelector('.portfolio-canvas') as HTMLElement).style.backgroundColor,
    ).toBe('rgb(32, 35, 42)');
  });

  it('switches editor categories, hero layouts and responsive preview size', async () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    const state = TestBed.inject(State);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    compiled.querySelector<HTMLButtonElement>('.editor-tab[aria-pressed="false"]')?.click();
    fixture.detectChanges();
    expect(compiled.querySelector('.editor-tab.active')?.textContent).toContain('Perfil & Hero');

    compiled.querySelector<HTMLButtonElement>('.hero-layout-option:nth-child(5)')?.click();
    fixture.detectChanges();
    expect(state.snapshot.heroLayout).toBe(5);

    expect(compiled.querySelectorAll('.device-switch button')).toHaveLength(3);
    expect(compiled.querySelector('.device-switch')?.textContent).toContain('Escritorio');
    expect(compiled.querySelector('.device-switch')?.textContent).toContain('Tablet');
    expect(compiled.querySelector('.device-switch')?.textContent).toContain('Móvil Android');

    const desktopButton = compiled.querySelector<HTMLButtonElement>(
      '[aria-label="Escritorio"]',
    )!;
    expect(desktopButton.getAttribute('aria-pressed')).toBe('true');
    compiled.querySelector<HTMLButtonElement>('[aria-label="Tablet"]')?.click();
    fixture.detectChanges();
    expect(compiled.querySelector('.portfolio-canvas')?.classList.contains('device-tablet')).toBe(
      true,
    );

    compiled.querySelector<HTMLButtonElement>('[aria-label="Móvil Android"]')?.click();
    fixture.detectChanges();
    expect(compiled.querySelector('.portfolio-canvas')?.classList.contains('device-mobile')).toBe(
      true,
    );
    expect(
      compiled.querySelector<HTMLButtonElement>('[aria-label="Móvil Android"]')?.getAttribute(
        'aria-pressed',
      ),
    ).toBe('true');
  });

  it('applies the profile name color directly to the Hero title preview', async () => {
    const fixture = TestBed.createComponent(App);
    const state = TestBed.inject(State);
    state.updateProfileStyles({ nameColor: '#123abc' });
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('.preview-hero h2') as HTMLElement;
    expect(title.style.color).toBe('rgb(18, 58, 188)');
  });

  it('updates the Hero title font size in state and live preview', async () => {
    const fixture = TestBed.createComponent(App);
    const state = TestBed.inject(State);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const slider = compiled.querySelector<HTMLInputElement>('#hero-title-size')!;
    slider.value = '4.6';
    slider.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(state.snapshot.profile.styles.heroTitleSize).toBe(4.6);
    expect((compiled.querySelector('.preview-hero h2') as HTMLElement).style.fontSize).toBe(
      '4.6rem',
    );
  });

  it('updates every Hero typography slider in state and live preview', async () => {
    const fixture = TestBed.createComponent(App);
    const state = TestBed.inject(State);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const sliderValues = [
      ['#hero-title-size', '4.4', 'heroTitleSize', '.preview-hero h2'],
      ['#hero-subtitle-size', '2.2', 'heroSubtitleSize', '.preview-hero .preview-eyebrow'],
      ['#hero-bio-size', '1.5', 'heroBioSize', '.preview-hero .preview-bio'],
      ['#hero-button-size', '1.3', 'heroButtonSize', '.preview-hero .preview-pill'],
    ] as const;

    for (const [selector, value, property, previewSelector] of sliderValues) {
      const slider = compiled.querySelector<HTMLInputElement>(selector)!;
      slider.value = value;
      slider.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(state.snapshot.profile.styles[property]).toBe(Number(value));
      expect((compiled.querySelector(previewSelector) as HTMLElement).style.fontSize).toBe(
        `${value}rem`,
      );
    }
  });

  it('adds and removes projects', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    const initialCount = app['userProjects'].length;

    app['addProject']();
    expect(app['userProjects']).toHaveLength(initialCount + 1);

    app['removeProject'](app['userProjects'][initialCount].id);
    expect(app['userProjects']).toHaveLength(initialCount);
  });

  it('reorders sections after a drag and drop', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    const state = TestBed.inject(State);
    const firstSection = state.snapshot.sections[0];

    app['drop']({
      previousIndex: 0,
      currentIndex: 1,
    } as CdkDragDrop<PortfolioSection[]>);

    expect(state.snapshot.sections[1]).toBe(firstSection);
  });

  it('replays the selected animation in the preview', async () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    const section = app['sections'].find((item) => item.id === 'hero')!;

    app['updateSectionAnimation'](section.id, 'slideInLeft');
    await new Promise((resolve) => setTimeout(resolve, 25));

    const updatedSection = app['sections'].find((item) => item.id === 'hero')!;
    expect(app['previewAnimationClasses'](updatedSection)).toEqual({
      animate__animated: true,
      animate__slideInLeft: true,
    });
  });

  it('exports visible sections in order and escapes profile content', () => {
    const fixture = TestBed.createComponent(App);
    const state = TestBed.inject(State);
    const generator = TestBed.inject(Generator);
    state.updateProfile({ name: '<script>alert(1)</script>' });
    state.reorderSections(0, state.snapshot.sections.length - 1);
    state.updateSectionVisibility('nav', false);

    const html = generator.generateHtml(state.snapshot);

    expect(html).not.toContain('<script>alert(1)</script>');
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(html.indexOf('id="home"')).toBeLessThan(html.indexOf('id="projects"'));
    expect(html.indexOf('id="projects"')).toBeLessThan(html.indexOf('id="contact"'));
    expect(html).not.toContain('aria-label="Navegación principal"');
  });
});
