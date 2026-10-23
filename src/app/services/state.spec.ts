import { TestBed } from '@angular/core/testing';
import { COLOR_PALETTES, State } from './state';

describe('State', () => {
  let service: State;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(State);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('publishes theme and profile updates through state$', () => {
    let emissions = 0;
    const subscription = service.state$.subscribe(() => emissions++);
    const initialEmissions = emissions;

    service.updateTheme({ primaryColor: '#123456' });
    service.updateProfile({ name: 'Taylor' });

    expect(service.snapshot.theme.primaryColor).toBe('#123456');
    expect(service.snapshot.profile.name).toBe('Taylor');
    expect(emissions).toBe(initialEmissions + 2);
    subscription.unsubscribe();
  });

  it('updates projects and section order, visibility, and animation', () => {
    const firstSection = service.snapshot.sections[0];
    const projectCount = service.snapshot.projects.length;

    service.addProject({ title: 'Nuevo', description: 'Detalle', link: 'https://example.com' });
    const addedProject = service.snapshot.projects[projectCount];
    service.updateProject(addedProject.id, { title: 'Actualizado' });
    service.updateProjectStyles(addedProject.id, { badgeText: 'Destacado' });
    service.removeProject(service.snapshot.projects[0].id);
    service.reorderSections(0, 1);
    service.updateSectionVisibility(firstSection.id, false);
    service.updateSectionAnimation(firstSection.id, {
      type: 'fadeIn',
      duration: 2,
      delay: 0.5,
    });

    expect(service.snapshot.projects).toHaveLength(projectCount);
    expect(service.snapshot.projects.at(-1)?.title).toBe('Actualizado');
    expect(service.snapshot.projects.at(-1)?.styles.badgeText).toBe('Destacado');
    expect(service.snapshot.sections[1].id).toBe(firstSection.id);
    expect(service.snapshot.sections[1].visible).toBe(false);
    expect(service.snapshot.sections[1].animation).toMatchObject({
      type: 'fadeIn',
      duration: 2,
      delay: 0.5,
    });
  });

  it('updates profile styles without replacing other profile style values', () => {
    const initialRoleColor = service.snapshot.profile.styles.roleColor;
    service.updateProfileStyles({
      nameColor: '#112233',
      heroTitleSize: 4.2,
      heroSubtitleSize: 2.1,
      heroBioSize: 1.3,
      heroButtonSize: 1.2,
      overlayOpacity: 0.6,
      avatarSize: 156,
      bannerHeight: 420,
    });

    expect(service.snapshot.profile.styles).toMatchObject({
      nameColor: '#112233',
      roleColor: initialRoleColor,
      heroTitleSize: 4.2,
      heroSubtitleSize: 2.1,
      heroBioSize: 1.3,
      heroButtonSize: 1.2,
      overlayOpacity: 0.6,
      avatarSize: 156,
      bannerHeight: 420,
    });
  });

  it('creates distinct project IDs and initializes project styles', () => {
    service.addProject();
    service.addProject();

    const addedProjects = service.snapshot.projects.slice(1);
    expect(new Set(addedProjects.map((project) => project.id)).size).toBe(2);
    expect(addedProjects[0].styles).toEqual({
      cardBgColor: '#ffffff',
      titleColor: '#20202a',
      descriptionColor: '#626273',
      buttonBgColor: '#6c63ff',
      buttonTextColor: '#ffffff',
      borderColor: '#e4e4eb',
      badgeText: '',
    });
  });

  it('updates preloader settings without resetting other options', () => {
    service.updatePreloader({ style: 'bars', text: 'Un momento', bgColor: '#112233' });

    expect(service.snapshot.preloader).toEqual({
      enabled: true,
      style: 'bars',
      text: 'Un momento',
      bgColor: '#112233',
      textColor: '#20202a',
    });

    service.updatePreloader({ enabled: false });
    expect(service.snapshot.preloader.enabled).toBe(false);
    expect(service.snapshot.preloader.style).toBe('bars');
  });

  it('applies palette colors and updates hero layout', () => {
    service.applyPalette('sunset');
    service.updateHeroLayout(4);

    expect(service.snapshot.theme).toMatchObject({
      primaryColor: '#ea580c',
      globalBgColor: '#fff7ed',
      textColor: '#431407',
      paletteId: 'sunset',
    });
    expect(service.snapshot.profile.styles).toMatchObject({
      nameColor: '#431407',
      roleColor: '#c2410c',
      bioColor: '#7c2d12',
    });
    expect(service.snapshot.heroLayout).toBe(4);
  });

  it('provides pastel palettes and preserves independent section color overrides', () => {
    const pastelPaletteIds = [
      'pastel-red',
      'pastel-orange',
      'pastel-yellow',
      'pastel-green',
      'pastel-blue',
      'pastel-lavender',
      'neutral-minimal',
    ];

    for (const paletteId of pastelPaletteIds) {
      service.applyPalette(paletteId);
      expect(service.snapshot.theme.paletteId).toBe(paletteId);
      expect(
        service.snapshot.sections.every(
          (section) =>
            section.colors.bgColor &&
            section.colors.textColor &&
            section.colors.accentColor &&
            section.colors.cardBgColor,
        ),
      ).toBe(true);
    }

    service.updateSectionColors('skills', {
      bgColor: '#fefce8',
      textColor: '#422006',
      accentColor: '#854d0e',
      cardBgColor: '#fffef7',
    });
    service.updateSectionColors('reviews', { bgColor: '#eff6ff' });

    expect(service.snapshot.sections.find((section) => section.id === 'skills')?.colors).toEqual({
      bgColor: '#fefce8',
      textColor: '#422006',
      accentColor: '#854d0e',
      cardBgColor: '#fffef7',
    });
    expect(
      service.snapshot.sections.find((section) => section.id === 'reviews')?.colors.bgColor,
    ).toBe('#eff6ff');
    expect(
      service.snapshot.sections.find((section) => section.id === 'projects')?.colors.bgColor,
    ).toBe('#f5f5f4');
  });

  it('applies the technology palettes to theme, profile, and every section', () => {
    const expectedPalettes = [
      { id: 'tech-bootstrap', primary: '#7952b3', background: '#212529', section: '#2b3035' },
      { id: 'tech-ubuntu', primary: '#E95420', background: '#300A24', section: '#111111' },
      { id: 'tech-angular', primary: '#DD0031', background: '#0f172a', section: '#1e1e24' },
      { id: 'tech-react', primary: '#61DAFB', background: '#20232a', section: '#282c34' },
    ];

    for (const palette of expectedPalettes) {
      service.applyPalette(palette.id);
      expect(service.snapshot.theme).toMatchObject({
        primaryColor: palette.primary,
        globalBgColor: palette.background,
        paletteId: palette.id,
      });
      expect(service.snapshot.sections.every((section) => section.colors.bgColor === palette.section))
        .toBe(true);
    }

    service.applyPalette('');
    expect(service.snapshot.theme.paletteId).toBe('');
  });

  it('keeps pastel palette text and accents at accessible contrast against their backgrounds', () => {
    const luminance = (color: string): number => {
      const channels = color.match(/[a-f\d]{2}/gi)!.map((channel) => parseInt(channel, 16) / 255);
      const linear = channels.map((value) =>
        value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
      );
      return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
    };
    const contrast = (foreground: string, background: string): number => {
      const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
      return (values[0] + 0.05) / (values[1] + 0.05);
    };

    for (const palette of COLOR_PALETTES.filter(
      (item) => item.id.startsWith('pastel-') || item.id === 'neutral-minimal',
    )) {
      expect(contrast(palette.textColor, palette.globalBgColor)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(palette.accentColor, palette.globalBgColor)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('manages horizontal cards, reviews, ratings, and social links', () => {
    service.addHorizontalCard({ title: 'Destacado' });
    service.addReview({ name: 'Sam', rating: 8 });
    service.addRating({ label: 'Diseño', level: 120 });
    service.addSocialLink('github');
    service.addSocialLink('github');

    const card = service.snapshot.horizontalCards.at(-1)!;
    const review = service.snapshot.reviews.at(-1)!;
    const rating = service.snapshot.ratings.at(-1)!;
    service.updateHorizontalCard(card.id, { description: 'Detalle' });
    service.updateReview(review.id, { comment: 'Muy bien' });
    service.updateRating(rating.id, { level: 72 });
    service.updateSocialLink('github', 'https://github.com/example');

    expect(service.snapshot.horizontalCards.at(-1)).toMatchObject({
      title: 'Destacado',
      description: 'Detalle',
    });
    expect(service.snapshot.reviews.at(-1)).toMatchObject({
      name: 'Sam',
      rating: 5,
      comment: 'Muy bien',
    });
    expect(service.snapshot.ratings.at(-1)).toMatchObject({ label: 'Diseño', level: 72 });
    expect(service.snapshot.socialLinks).toEqual([
      { id: 'github', href: 'https://github.com/example', placement: 'hero' },
    ]);

    service.removeHorizontalCard(card.id);
    service.removeReview(review.id);
    service.removeRating(rating.id);
    service.removeSocialLink('github');
    expect(service.snapshot.horizontalCards.some((item) => item.id === card.id)).toBe(false);
    expect(service.snapshot.reviews.some((item) => item.id === review.id)).toBe(false);
    expect(service.snapshot.ratings.some((item) => item.id === rating.id)).toBe(false);
    expect(service.snapshot.socialLinks).toHaveLength(0);
  });
});
