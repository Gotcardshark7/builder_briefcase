import { TestBed } from '@angular/core/testing';
import { Generator } from './generator';
import { State } from './state';

describe('Generator', () => {
  let service: Generator;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Generator);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('generates the ordered HTML with escaped content and animation settings', () => {
    const state = TestBed.inject(State);
    state.updateProfile({ name: '<Alex & Co>' });
    state.updateProfile({
      avatarUrl: 'data:image/png;base64,ZmFrZQ==',
      bannerUrl: 'https://example.com/banner.jpg',
    });
    state.updateProfileStyles({
      nameColor: '#112233',
      heroTitleSize: 4.2,
      heroSubtitleSize: 2.1,
      heroBioSize: 1.3,
      heroButtonSize: 1.2,
      bannerHeight: 360,
      avatarSize: 144,
      overlayOpacity: 0.4,
    });
    state.updateSectionAnimation('hero', {
      type: 'fadeInUp',
      duration: 1.8,
      delay: 0.3,
    });
    state.updateProjectStyles('proj-1', {
      cardBgColor: '#eeeeee',
      badgeText: 'Selección',
    });
    state.updateProject('proj-1', { imageUrl: 'data:image/png;base64,cHJvamVjdA==' });
    state.reorderSections(0, 2);

    const html = service.generateHtml(state.snapshot);
    const css = service.generateCss(state.snapshot);

    expect(html).toContain(
      'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css',
    );
    expect(html).toContain(
      '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css">',
    );
    expect(html).toContain('<link rel="stylesheet" href="style.css">');
    expect(html).toContain('&lt;Alex &amp; Co&gt;');
    expect(html).toContain('animate__animated animate__fadeInUp');
    expect(html).toContain('--section-duration: 1.8s; --section-delay: 0.3s');
    expect(html.indexOf('id="home"')).toBeLessThan(html.indexOf('id="projects"'));
    expect(html).toContain('id="profile-banner"');
    expect(html).toContain('id="profile-avatar"');
    expect(html).toContain('id="profile-name"');
    expect(html).toContain('id="profile-role"');
    expect(html).toContain('id="profile-bio"');
    expect(html).toContain('data:image/png;base64,ZmFrZQ==');
    expect(html).toContain('data:image/png;base64,cHJvamVjdA==');
    expect(html).toContain('Selección');
    expect(css).toContain('--primary-color: #6c63ff');
    expect(css).toContain('.portfolio { width: 100%; margin: 0; }');
    expect(css).toContain('.portfolio-section { width: 100%;');
    expect(css).toContain('padding: 3rem max(1rem, calc((100% - 1400px) / 2))');
    expect(css).toContain('--name-color: #112233');
    expect(css).toContain('--hero-title-size: 4.2rem');
    expect(css).toContain('--hero-subtitle-size: 2.1rem');
    expect(css).toContain('--hero-bio-size: 1.3rem');
    expect(css).toContain('--hero-button-size: 1.2rem');
    expect(css).toContain('--banner-height: 360px');
    expect(css).toContain('--avatar-size: 144px');
    expect(css).toContain('#profile-banner');
    expect(css).toContain('background-image: url("https://example.com/banner.jpg")');
    expect(css).toContain('background-repeat: no-repeat');
    expect(css).toContain('#profile-banner::before');
    expect(css).toContain('url("https://example.com/banner.jpg")');
    expect(css).toContain('[data-section-id="hero"]');
    expect(css).toContain('#proj-1 { background-color: #eeeeee');
    expect(css).toContain('#proj-1 .project-title');
    expect(css).toContain('#proj-1 .btn-view');
    expect(html).toContain('<div id="profile-banner"><div class="hero-content">');
  });

  it('omits hidden sections and rejects unsafe exported links', () => {
    const state = TestBed.inject(State);
    state.updateSectionVisibility('hero', false);
    state.updateProject('proj-1', { link: 'javascript:alert(1)' });

    const html = service.generateHtml(state.snapshot);

    expect(html).not.toContain('id="home"');
    expect(html).not.toContain('href="javascript:alert(1)"');
  });

  it('generates an enabled preloader before the portfolio and hides it on load', () => {
    const state = TestBed.inject(State);
    state.updatePreloader({
      style: 'pulse',
      text: '<Preparando>',
      bgColor: '#123456',
      textColor: '#ffffff',
    });

    const html = service.generateHtml(state.snapshot);
    const css = service.generateCss(state.snapshot);

    expect(html.indexOf('<body>')).toBeLessThan(html.indexOf('id="portfolio-preloader"'));
    expect(html.indexOf('id="portfolio-preloader"')).toBeLessThan(html.indexOf('<main'));
    expect(html).toContain('preloader-pulse');
    expect(html).toContain('&lt;Preparando&gt;');
    expect(html).toContain("window.addEventListener('load'");
    expect(html).toContain("p.classList.add('is-hidden')");
    expect(css).toContain('position: fixed; inset: 0; z-index: 9999');
    expect(css).toContain('@keyframes preloader-spin');
    expect(css).toContain('@keyframes preloader-pulse');
    expect(css).toContain('@keyframes preloader-bars');
    expect(css).toContain('background: #123456; color: #ffffff');
  });

  it('omits the exported preloader and script when disabled', () => {
    const state = TestBed.inject(State);
    state.updatePreloader({ enabled: false });

    const html = service.generateHtml(state.snapshot);

    expect(html).not.toContain('id="portfolio-preloader"');
    expect(html).not.toContain("window.addEventListener('load'");
  });

  it('exports each hero layout and the new card, review, rating, and social content', () => {
    const state = TestBed.inject(State);
    state.updateHeroLayout(4);
    state.updateHorizontalCard('card-1', {
      title: '<Card>',
      description: 'Descripción segura',
      imageUrl: 'https://example.com/card.png',
      link: 'https://example.com/detail',
    });
    state.updateReview('review-1', {
      name: 'Cliente',
      role: 'Dirección',
      comment: 'Gran trabajo',
      rating: 4,
    });
    state.updateRating('rating-1', { label: 'Diseño', level: 85 });
    state.addSocialLink('github');
    expect(service.generateHtml(state.snapshot)).toContain('<span aria-label="GitHub"');
    state.updateSocialLink('github', 'https://github.com/example');

    const html = service.generateHtml(state.snapshot);
    const css = service.generateCss(state.snapshot);

    expect(html).toContain('class="portfolio-section section-hero hero-layout-4"');
    expect(html).toContain('&lt;Card&gt;');
    expect(html).toContain('class="horizontal-card"');
    expect(html).toContain('class="review-card"');
    expect(html).toContain('aria-label="4 de 5 estrellas"');
    expect(html).toContain('href="https://github.com/example"');
    expect(html).toContain('<svg viewBox="0 0 24 24"');
    expect(html).toContain('fonts.googleapis.com/css2?family=Fira+Code');
    expect(css).toContain('#home.hero-layout-4 .hero-content');
    expect(css).toContain('.horizontal-card img');
    expect(css).toContain('.preloader-spinner');
    expect(css).toContain('.rating-track span');

    for (const layout of [1, 2, 3, 4, 5] as const) {
      state.updateHeroLayout(layout);
      expect(service.generateHtml(state.snapshot)).toContain(`hero-layout-${layout}`);
    }
  });

  it('exports scoped section color rules and section colors on default project cards', () => {
    const state = TestBed.inject(State);
    state.applyPalette('pastel-green');
    state.updateSectionColors('skills', {
      bgColor: '#fefce8',
      textColor: '#422006',
      accentColor: '#854d0e',
      cardBgColor: '#fffef7',
    });

    const html = service.generateHtml(state.snapshot);
    const css = service.generateCss(state.snapshot);

    expect(html).toContain('class="portfolio-section section-skills"');
    expect(html).toContain('class="portfolio-section section-reviews"');
    expect(css).toContain('.section-skills { --section-bg-color: #fefce8');
    expect(css).toContain('--section-text-color: #422006');
    expect(css).toContain('--section-accent-color: #854d0e');
    expect(css).toContain('--section-card-bg-color: #fffef7');
    expect(css).toContain('#proj-1 { background-color: #f7fffb');
    expect(css).toContain('.section-reviews .review-card');
    for (const sectionType of [
      'nav',
      'hero',
      'projects',
      'horizontal-cards',
      'skills',
      'reviews',
      'contact',
    ]) {
      expect(css).toContain(`.section-${sectionType} { --section-bg-color:`);
    }
  });

  it('exports the configured font and section colors alongside full-width section rules', () => {
    const state = TestBed.inject(State);
    state.updateTheme({ fontFamily: '"Playfair Display", serif' });
    state.updateSectionColors('contact', {
      bgColor: '#fefce8',
      textColor: '#422006',
      accentColor: '#854d0e',
      cardBgColor: '#fffef7',
    });

    const css = service.generateCss(state.snapshot);
    const html = service.generateHtml(state.snapshot);

    expect(css).toContain('--font-family: "Playfair Display", serif');
    expect(css).toContain('.section-contact { --section-bg-color: #fefce8');
    expect(css).toContain('.portfolio-section { width: 100%;');
    expect(html).toContain('fonts.googleapis.com/css2?family=Fira+Code');
  });

  it('exports selected technology palette colors into the downloadable stylesheet', () => {
    const state = TestBed.inject(State);
    state.applyPalette('tech-react');

    const css = service.generateCss(state.snapshot);

    expect(css).toContain('--primary-color: #61DAFB');
    expect(css).toContain('--background-color: #20232a');
    expect(css).toContain('--section-bg-color: #282c34');
    expect(css).toContain('--section-accent-color: #61DAFB');
    expect(css).toContain('--role-color: #a5f3fc');
  });

  it('keeps the configured profile name color for every Hero layout', () => {
    const state = TestBed.inject(State);
    state.updateProfileStyles({ nameColor: '#123abc' });
    state.updateSectionColors('hero', { textColor: '#fefce8' });

    for (const layout of [1, 2, 3, 4, 5] as const) {
      state.updateHeroLayout(layout);
      const css = service.generateCss(state.snapshot);
      expect(css).toContain('--name-color: #123abc');
      expect(css).toContain('#profile-name {');
      expect(css).not.toContain('#home.hero-layout-2 { --name-color:');
      expect(css).not.toContain('.section-hero #profile-name');
    }
  });

  it('centers the text and actions in the exported glass central Hero layout', () => {
    const state = TestBed.inject(State);
    state.updateHeroLayout(5);

    const html = service.generateHtml(state.snapshot);
    const css = service.generateCss(state.snapshot);

    expect(html).toContain('class="portfolio-section section-hero hero-layout-5"');
    expect(css).toContain(
      '#home.hero-layout-5 .hero-copy { display: flex; flex-direction: column; align-items: center; margin: 0 auto; text-align: center !important; }',
    );
  });

  it('exports a bounded Hero title font size from profile styles', () => {
    const state = TestBed.inject(State);
    state.updateProfileStyles({ heroTitleSize: 5.6 });

    expect(service.generateCss(state.snapshot)).toContain('--hero-title-size: 5.6rem');

    state.updateProfileStyles({ heroTitleSize: 20 });
    expect(service.generateCss(state.snapshot)).toContain('--hero-title-size: 6rem');
  });

  it('exports bounded font sizes for every Hero text element and CTA', () => {
    const state = TestBed.inject(State);
    state.updateProfileStyles({
      heroSubtitleSize: 2.4,
      heroBioSize: 1.6,
      heroButtonSize: 1.3,
    });

    const css = service.generateCss(state.snapshot);
    const html = service.generateHtml(state.snapshot);

    expect(css).toContain('--hero-subtitle-size: 2.4rem');
    expect(css).toContain('--hero-bio-size: 1.6rem');
    expect(css).toContain('--hero-button-size: 1.3rem');
    expect(css).toContain('font-size: var(--hero-subtitle-size)');
    expect(css).toContain('font-size: var(--hero-bio-size)');
    expect(css).toContain('font-size: var(--hero-button-size)');
    expect(html).toContain('<span class="hero-pill">Disponible para proyectos</span>');
  });

  it('renders inline social SVGs at the selected location and converts WhatsApp phone numbers', () => {
    const state = TestBed.inject(State);
    state.addSocialLink('whatsapp');
    state.updateSocialLink('whatsapp', '+1 (555) 123-4567');
    state.addSocialLink('instagram');
    state.updateSocialLink('instagram', 'https://instagram.com/example');
    state.updateSocialLinkPlacement('instagram', 'contact');
    state.addSocialLink('linkedin');
    state.updateSocialLink('linkedin', 'https://linkedin.com/in/example');
    state.updateSocialLinkPlacement('linkedin', 'footer');

    const html = service.generateHtml(state.snapshot);
    const heroStart = html.indexOf('class="social-links social-links-hero"');
    const contactStart = html.indexOf('class="social-links social-links-contact"');
    const hero = html.slice(heroStart, html.indexOf('</section>', heroStart));
    const contact = html.slice(contactStart, html.indexOf('</section>', contactStart));
    const footer = html.slice(html.indexOf('class="portfolio-footer"'));

    expect(html).toContain('href="https://wa.me/15551234567"');
    expect(hero).toContain('aria-label="WhatsApp"');
    expect(hero).not.toContain('aria-label="Instagram"');
    expect(contact).toContain('aria-label="Instagram"');
    expect(contact).not.toContain('aria-label="LinkedIn"');
    expect(footer).toContain('aria-label="LinkedIn"');
    expect(html).toContain('<svg viewBox="0 0 24 24"');
    expect(html).not.toContain('SVGRepo');

    state.updateSocialLink('whatsapp', 'javascript:alert(1)');
    expect(service.generateHtml(state.snapshot)).not.toContain('href="javascript:alert(1)"');
  });
});
