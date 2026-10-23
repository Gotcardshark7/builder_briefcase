import { Injectable } from '@angular/core';
import { AnimationType } from '../models/portfolio.model';
import {
  HeroLayout,
  GENERIC_SOCIAL_ICON,
  HorizontalCard,
  PortfolioProject,
  PortfolioReview,
  PortfolioSection,
  PortfolioState,
  PortfolioSocialLink,
  SocialPlacement,
  SectionColors,
  SOCIAL_ICON_CATALOG,
} from './state';

const ANIMATE_CSS_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css';
const ANIMATION_TYPES: AnimationType[] = [
  'none',
  'fadeIn',
  'fadeInDown',
  'fadeInUp',
  'zoomIn',
  'bounceIn',
  'slideInLeft',
  'slideInRight',
  'pulse',
  'rubberBand',
];
const PRELOADER_STYLES = ['spinner', 'pulse', 'bars'] as const;
const GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&family=Inter:wght@400;600;700&family=Montserrat:wght@400;600;700&family=Outfit:wght@400;600;700&family=Playfair+Display:wght@400;600;700&family=Poppins:wght@400;600;700&family=Roboto:wght@400;500;700&display=swap';

@Injectable({ providedIn: 'root' })
export class Generator {
  async exportPortfolio(portfolio: PortfolioState): Promise<void> {
    const [{ default: JSZip }, { saveAs }] = await Promise.all([
      import('jszip'),
      import('file-saver'),
    ]);
    const zip = new JSZip();
    zip.file('index.html', this.generateHtml(portfolio));
    zip.file('style.css', this.generateCss(portfolio));
    const archive = await zip.generateAsync({ type: 'blob' });
    saveAs(archive, 'mi-portfolio.zip');
  }

  generateHtml(portfolio: PortfolioState): string {
    const { profile, sections } = portfolio;
    const renderedSections = sections
      .filter((section) => section.visible)
      .map((section) => this.renderSection(section, portfolio))
      .join('\n');
    const title = this.escapeHtml(profile.name || 'Mi portfolio');
    const footerSocials = this.renderSocialLinks(portfolio.socialLinks, 'footer');
    const preloader = portfolio.preloader.enabled
      ? `<div id="portfolio-preloader" class="preloader preloader-${this.validPreloaderStyle(portfolio.preloader.style)}" role="status" aria-live="polite"><span class="preloader-animation preloader-${this.validPreloaderStyle(portfolio.preloader.style)}" aria-hidden="true">${this.preloaderMarkup(portfolio.preloader.style)}</span><p>${this.escapeHtml(portfolio.preloader.text)}</p></div>`
      : '';
    const preloaderScript = portfolio.preloader.enabled
      ? `<script>window.addEventListener('load',()=>{const p=document.getElementById('portfolio-preloader');if(p){p.classList.add('is-hidden');p.addEventListener('transitionend',()=>p.hidden=true,{once:true});setTimeout(()=>p.hidden=true,600);}});</script>`
      : '';

    return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${this.escapeHtml(profile.bio)}">
  <title>${title}</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${GOOGLE_FONTS_URL}" rel="stylesheet">
  <link rel="stylesheet" href="${ANIMATE_CSS_CDN}">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  ${preloader}
  <main class="portfolio">${renderedSections}</main>
  ${footerSocials ? `<footer class="portfolio-footer">${footerSocials}</footer>` : ''}
  ${preloaderScript}
</body>
</html>`;
  }

  generateCss(portfolio: PortfolioState): string {
    const { theme, profile, projects } = portfolio;
    const bannerUrl = this.safeImageUrl(profile.bannerUrl);
    const projectStyles = projects
      .map((project, index) =>
        this.projectCss(
          project,
          index,
          portfolio.sections.find((section) => section.type === 'projects')?.colors,
        ),
      )
      .join('\n');
    const sectionStyles = portfolio.sections.map((section) => this.sectionCss(section)).join('\n');
    const hero2RoleColor =
      this.safeColor(profile.styles.roleColor, '#6c63ff').toLowerCase() === '#ffffff'
        ? this.safeColor(theme.primaryColor, '#6c63ff')
        : this.safeColor(profile.styles.roleColor, '#6c63ff');
    const hero2BioColor =
      this.safeColor(profile.styles.bioColor, '#626273').toLowerCase() === '#f2f2f7'
        ? this.safeColor(theme.textColor, '#20202a')
        : this.safeColor(profile.styles.bioColor, '#626273');

    return `@import url("${GOOGLE_FONTS_URL}");
:root {
  color-scheme: light;
  --primary-color: ${this.safeColor(theme.primaryColor, '#6c63ff')};
  --background-color: ${this.safeColor(theme.globalBgColor, '#f4f5f9')};
  --text-color: ${this.safeColor(theme.textColor, '#20202a')};
  --font-family: ${this.safeFontFamily(theme.fontFamily)};
  --name-color: ${this.safeColor(profile.styles.nameColor, '#20202a')};
  --role-color: ${this.safeColor(profile.styles.roleColor, '#6c63ff')};
  --bio-color: ${this.safeColor(profile.styles.bioColor, '#626273')};
  --hero-title-size: ${this.safeNumber(profile.styles.heroTitleSize, 3, 2, 6)}rem;
  --hero-subtitle-size: ${this.safeNumber(profile.styles.heroSubtitleSize, 1.5, 1, 3)}rem;
  --hero-bio-size: ${this.safeNumber(profile.styles.heroBioSize, 1.1, 0.8, 2)}rem;
  --hero-button-size: ${this.safeNumber(profile.styles.heroButtonSize, 1, 0.8, 1.5)}rem;
  --banner-overlay-opacity: ${this.safeOpacity(profile.styles.overlayOpacity)};
  --banner-height: ${this.safeNumber(profile.styles.bannerHeight, 280, 120, 800)}px;
  --avatar-size: ${this.safeNumber(profile.styles.avatarSize, 112, 48, 240)}px;
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; background: var(--background-color); color: var(--text-color); font-family: var(--font-family); }
.portfolio { width: 100%; margin: 0; }
.portfolio-section { width: 100%; animation-duration: var(--section-duration, 1s); animation-delay: var(--section-delay, 0s); }
.portfolio-section:not(.section-nav) { padding: 3rem max(1rem, calc((100% - 1400px) / 2)); }
.section-nav { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 1.5rem max(1rem, calc((100% - 1400px) / 2)); }
.navigation-links { display: flex; gap: 1rem; }
.portfolio-footer { width: 100%; padding: 1rem max(1rem, calc((100% - 1400px) / 2)) 2rem; text-align: center; }
.portfolio-footer .social-links { justify-content: center; }
a { color: var(--primary-color); }
section { padding: 3rem 0; }
#profile-banner { position: relative; display: flex; min-height: var(--banner-height); align-items: center; overflow: hidden; padding: 2rem; border-radius: 16px; background-color: #252532; background-image: ${bannerUrl ? `url("${this.cssString(bannerUrl)}")` : 'none'}; background-position: center; background-repeat: no-repeat; background-size: cover; color: #fff; box-shadow: 0 16px 40px #20202a1a; }
#profile-banner::before { position: absolute; inset: 0; z-index: 0; background: rgba(0, 0, 0, var(--banner-overlay-opacity)); content: ""; }
#profile-avatar { position: relative; z-index: 1; display: block; width: var(--avatar-size); height: var(--avatar-size); margin-bottom: 1.25rem; border: 5px solid #ffffff80; border-radius: 50%; object-fit: cover; box-shadow: 0 8px 24px #0004; }
#profile-name { position: relative; z-index: 1; margin: .25rem 0; color: var(--name-color); font-size: var(--hero-title-size); letter-spacing: -.06em; }
#profile-role { position: relative; z-index: 1; color: var(--role-color); font-size: var(--hero-subtitle-size); font-weight: 700; }
#profile-bio { position: relative; z-index: 1; max-width: 42rem; color: var(--bio-color); font-size: var(--hero-bio-size); line-height: 1.75; }
.hero-pill { display: inline-block; padding: .5rem .8rem; border: 1px solid color-mix(in srgb, var(--primary-color) 30%, white); border-radius: 99px; color: var(--primary-color); font-size: var(--hero-button-size); font-weight: 600; }
.hero-content { position: relative; z-index: 1; width: 100%; }
.hero-copy { min-width: 0; }
#home.hero-layout-2 #profile-banner { min-height: var(--banner-height); background-color: transparent; background-image: none; color: #20202a; box-shadow: none; }
#home.hero-layout-2 { --role-color: ${hero2RoleColor}; --bio-color: ${hero2BioColor}; }
#home.hero-layout-2 #profile-banner::before { display: none; }
#home.hero-layout-2 #profile-name { color: var(--name-color); }
#home.hero-layout-2 #profile-role { color: var(--role-color); }
#home.hero-layout-2 #profile-bio { color: var(--bio-color); }
#home.hero-layout-3 #profile-banner { align-items: flex-end; padding-bottom: 2rem; }
#home.hero-layout-3 #profile-avatar { position: absolute; top: 1.5rem; left: 2rem; margin: 0; }
#home.hero-layout-3 .hero-content { padding-top: calc(var(--avatar-size) + 1rem); }
#home.hero-layout-4 #profile-banner { align-items: center; }
#home.hero-layout-4 .hero-content { display: flex; align-items: center; gap: clamp(2rem, 6vw, 5rem); }
#home.hero-layout-4 #profile-avatar { flex: 0 0 var(--avatar-size); margin: 0; }
#home.hero-layout-4 .hero-copy { flex: 1; }
#home.hero-layout-5 #profile-banner { justify-content: center; text-align: center; }
#home.hero-layout-5 .hero-content { width: min(100%, 760px); padding: 2.5rem; border: 1px solid #ffffff60; border-radius: 24px; background: #ffffff20; box-shadow: 0 18px 60px #0002; backdrop-filter: blur(18px); }
#home.hero-layout-5 .hero-copy { display: flex; flex-direction: column; align-items: center; margin: 0 auto; text-align: center !important; }
#home.hero-layout-5 #profile-avatar { margin-right: auto; margin-left: auto; }
#home.hero-layout-5 #profile-bio { margin-right: auto; margin-left: auto; }
.social-links { display: flex; flex-wrap: wrap; gap: .75rem; margin-top: 1.25rem; }
.social-links a, .social-links span { display: inline-grid; width: 2.75rem; height: 2.75rem; place-items: center; border: 1px solid currentColor; border-radius: 50%; color: var(--primary-color); }
.social-links svg { width: 1.25rem; height: 1.25rem; fill: none; stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 1.8; }
.horizontal-cards { display: grid; gap: 1rem; }
.horizontal-card { display: grid; grid-template-columns: minmax(180px, 32%) 1fr; overflow: hidden; border: 1px solid #20202a18; border-radius: 16px; background: #fff; box-shadow: 0 12px 32px #20202a12; }
.horizontal-card img { width: 100%; height: 100%; min-height: 180px; object-fit: cover; }
.horizontal-card-content { align-self: center; padding: 1.5rem; }
.horizontal-card-content h3 { margin-top: 0; }
.horizontal-card-content p { line-height: 1.65; }
.horizontal-card-content a { display: inline-block; margin-top: .5rem; padding: .65rem 1rem; border-radius: 10px; background: var(--primary-color); color: #fff; font-weight: 700; text-decoration: none; }
.reviews-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr)); gap: 1rem; }
.review-card { padding: 1.25rem; border: 1px solid #20202a18; border-radius: 16px; background: #fff; }
.review-stars { color: #f59e0b; font-size: 1.2rem; letter-spacing: .1em; }
.review-card p { line-height: 1.6; }
.review-role { display: block; margin-top: .25rem; color: #6b7280; font-size: .85rem; }
.rating-bars { display: grid; gap: 1rem; margin-top: 2rem; }
.rating-label { display: flex; justify-content: space-between; gap: 1rem; margin-bottom: .35rem; }
.rating-track { height: .6rem; overflow: hidden; border-radius: 99px; background: #20202a18; }
.rating-track span { display: block; height: 100%; border-radius: inherit; background: var(--primary-color); }
.eyebrow { color: var(--primary-color); font-size: .75rem; font-weight: 700; letter-spacing: .14em; }
.projects { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr)); gap: 1rem; }
.project-card { position: relative; overflow: hidden; padding: 24px; border: 1px solid; border-radius: 16px; box-shadow: 0 12px 32px #20202a12; transition: transform 180ms ease, box-shadow 180ms ease; }
.project-card:hover { transform: translateY(-4px); box-shadow: 0 18px 40px #20202a1c; }
.project-image { display: block; width: calc(100% + 48px); max-height: 220px; margin: -24px -24px 1rem; object-fit: cover; }
.project-title { margin: .75rem 0; }
.project-description { line-height: 1.65; }
.btn-view { display: inline-block; margin-top: .75rem; padding: .65rem 1rem; border-radius: 10px; font-weight: 700; text-decoration: none; }
.project-badge { display: inline-block; margin-bottom: .5rem; padding: .35rem .65rem; border-radius: 99px; background: var(--primary-color); color: #fff; font-size: .72rem; font-weight: 700; }
.contact { padding: 3rem; border: 1px solid #ffffff70; border-radius: 16px; background: #ffffffad; box-shadow: 0 16px 48px #20202a10; backdrop-filter: blur(12px); }
.skills-list { display: flex; flex-wrap: wrap; gap: .75rem; }
.skills-list span { padding: .6rem .9rem; border: 1px solid #ffffff80; border-radius: 99px; background: #ffffffa8; }
#portfolio-preloader { position: fixed; inset: 0; z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; background: ${this.safeColor(portfolio.preloader.bgColor, '#ffffff')}; color: ${this.safeColor(portfolio.preloader.textColor, '#20202a')}; opacity: 1; transition: opacity .5s ease; }
#portfolio-preloader.is-hidden { opacity: 0; pointer-events: none; }
#portfolio-preloader[hidden] { display: none; }
#portfolio-preloader p { margin: 0; }
.preloader-animation { display: flex; min-height: 3rem; align-items: center; justify-content: center; gap: .45rem; }
.preloader-spinner { width: 3rem; height: 3rem; border: 4px solid currentColor; border-right-color: transparent; border-radius: 50%; animation: preloader-spin .8s linear infinite; }
.preloader-pulse i { width: .7rem; height: .7rem; border-radius: 50%; background: currentColor; animation: preloader-pulse .9s ease-in-out infinite; }
.preloader-pulse i:nth-child(2) { animation-delay: .15s; }
.preloader-pulse i:nth-child(3) { animation-delay: .3s; }
.preloader-bars i { width: .45rem; height: 1.5rem; border-radius: .25rem; background: currentColor; animation: preloader-bars .8s ease-in-out infinite; }
.preloader-bars i:nth-child(2) { animation-delay: .1s; }
.preloader-bars i:nth-child(3) { animation-delay: .2s; }
.preloader-bars i:nth-child(4) { animation-delay: .3s; }
@keyframes preloader-spin { to { transform: rotate(360deg); } }
@keyframes preloader-pulse { 0%, 80%, 100% { opacity: .35; transform: scale(.7); } 40% { opacity: 1; transform: scale(1); } }
@keyframes preloader-bars { 0%, 100% { transform: scaleY(.45); } 50% { transform: scaleY(1); } }
${this.sectionAnimationCss(portfolio.sections)}
${sectionStyles}
${projectStyles}
@media (max-width: 600px) {
  #profile-banner { min-height: min(var(--banner-height), 220px); padding: 1.5rem; }
  #home.hero-layout-4 .hero-content { align-items: flex-start; flex-direction: column; }
  #home.hero-layout-4 #profile-avatar { margin-bottom: 0; }
  .horizontal-card { grid-template-columns: 1fr; }
  .horizontal-card img { max-height: 220px; }
  .contact { padding: 2rem 1.25rem; }
}`;
  }

  private renderSection(section: PortfolioSection, portfolio: PortfolioState): string {
    const animation = this.validAnimation(section.animation.type);
    const animationClass = animation === 'none' ? '' : ` animate__animated animate__${animation}`;
    const sectionId = this.safeId(section.id, `section-${section.type}`);
    const heroClass =
      section.type === 'hero' ? ` hero-layout-${this.validHeroLayout(portfolio.heroLayout)}` : '';
    const attributes = `id="${this.sectionAnchor(section)}" data-section-id="${sectionId}" class="portfolio-section section-${section.type}${animationClass}${heroClass}" style="--section-duration: ${this.safeNumber(section.animation.duration, 1, 0, 60)}s; --section-delay: ${this.safeNumber(section.animation.delay, 0, 0, 60)}s"`;
    const { profile, projects } = portfolio;

    switch (section.type) {
      case 'nav':
        return `<nav ${attributes} aria-label="Navegación principal"><a href="#home">${this.escapeHtml(profile.name)}</a><div class="navigation-links"><a href="#projects">Proyectos</a><a href="#contact">Contacto</a></div></nav>`;
      case 'hero': {
        const avatarUrl = this.safeImageUrl(profile.avatarUrl);
        const avatar = avatarUrl
          ? `<img id="profile-avatar" src="${this.escapeHtml(avatarUrl)}" alt="Foto de ${this.escapeHtml(profile.name)}">`
          : '';
        const socials = this.renderSocialLinks(portfolio.socialLinks, 'hero');
        return `<section ${attributes}><div id="profile-banner"><div class="hero-content">${avatar}<div class="hero-copy"><p id="profile-role">${this.escapeHtml(profile.role)}</p><h1 id="profile-name">${this.escapeHtml(profile.name)}</h1><p id="profile-bio">${this.escapeHtml(profile.bio)}</p><span class="hero-pill">Disponible para proyectos</span>${socials}</div></div></div></section>`;
      }
      case 'projects': {
        const renderedProjects = projects
          .map((project, index) => this.renderProject(project, index))
          .join('\n');
        return `<section ${attributes}><p class="eyebrow">MI TRABAJO</p><h2>${this.escapeHtml(section.title)}</h2><div class="projects">${renderedProjects}</div></section>`;
      }
      case 'skills':
        return `<section ${attributes}><p class="eyebrow">${this.escapeHtml(section.title)}</p><div class="skills-list"><span>Diseño de producto</span><span>Desarrollo web</span><span>Prototipado</span></div></section>`;
      case 'horizontal-cards': {
        const cards = portfolio.horizontalCards
          .map((card) => this.renderHorizontalCard(card))
          .join('\n');
        return `<section ${attributes}><p class="eyebrow">DESTACADOS</p><h2>${this.escapeHtml(section.title)}</h2><div class="horizontal-cards">${cards}</div></section>`;
      }
      case 'reviews': {
        const reviews = portfolio.reviews.map((review) => this.renderReview(review)).join('\n');
        const ratings = portfolio.ratings
          .map((rating) => {
            const level = this.safeNumber(rating.level, 0, 0, 100);
            return `<div class="rating-item"><div class="rating-label"><span>${this.escapeHtml(rating.label)}</span><span>${level}%</span></div><div class="rating-track"><span style="width:${level}%"></span></div></div>`;
          })
          .join('\n');
        return `<section ${attributes}><p class="eyebrow">RECOMENDACIONES</p><h2>${this.escapeHtml(section.title)}</h2><div class="reviews-grid">${reviews}</div><div class="rating-bars">${ratings}</div></section>`;
      }
      case 'contact': {
        const socials = this.renderSocialLinks(portfolio.socialLinks, 'contact');
        return `<section ${attributes}><p class="eyebrow">${this.escapeHtml(section.title)}</p><h2>¿Creamos algo juntos?</h2><a href="mailto:hello@example.com">Contáctame</a>${socials}</section>`;
      }
    }
  }

  private renderProject(project: PortfolioProject, index: number): string {
    const id = this.safeId(project.id, `project-${index + 1}`);
    const imageUrl = this.safeImageUrl(project.imageUrl);
    const image = imageUrl
      ? `<img class="project-image" src="${this.escapeHtml(imageUrl)}" alt="${this.escapeHtml(project.title)}">`
      : '';
    const badge =
      project.featured || project.styles.badgeText
        ? `<span class="project-badge">${this.escapeHtml(project.styles.badgeText || 'Proyecto Destacado')}</span>`
        : '';
    const link = this.safeHref(project.link)
      ? `<a class="btn-view" href="${this.escapeHtml(project.link.trim())}" target="_blank" rel="noopener noreferrer">Ver proyecto</a>`
      : '';

    return `<article id="${id}" class="project-card">${image}${badge}<h3 class="project-title">${this.escapeHtml(project.title)}</h3><p class="project-description">${this.escapeHtml(project.description)}</p>${link}</article>`;
  }

  private renderHorizontalCard(card: HorizontalCard): string {
    const imageUrl = this.safeImageUrl(card.imageUrl);
    const image = imageUrl
      ? `<img src="${this.escapeHtml(imageUrl)}" alt="${this.escapeHtml(card.title)}">`
      : '';
    const link = this.safeHref(card.link)
      ? `<a href="${this.escapeHtml(card.link.trim())}" target="_blank" rel="noopener noreferrer">${this.escapeHtml(card.buttonLabel || 'Ver más')}</a>`
      : '';
    return `<article id="${this.safeId(card.id, 'horizontal-card')}" class="horizontal-card">${image}<div class="horizontal-card-content"><h3>${this.escapeHtml(card.title)}</h3><p>${this.escapeHtml(card.description)}</p>${link}</div></article>`;
  }

  private renderReview(review: PortfolioReview): string {
    const rating = this.safeNumber(review.rating, 0, 0, 5);
    const roundedRating = Math.round(rating);
    const stars = '★'.repeat(roundedRating) + '☆'.repeat(5 - roundedRating);
    return `<article id="${this.safeId(review.id, 'review')}" class="review-card"><div class="review-stars" role="img" aria-label="${rating} de 5 estrellas">${stars}</div><p>${this.escapeHtml(review.comment)}</p><strong>${this.escapeHtml(review.name)}</strong><span class="review-role">${this.escapeHtml(review.role)}</span></article>`;
  }

  private renderSocialLinks(links: PortfolioSocialLink[], placement: SocialPlacement): string {
    const icons = links
      .filter((link) => link.placement === placement)
      .map((link) => {
        const icon = SOCIAL_ICON_CATALOG.find((item) => item.id === link.id);
        const label = icon?.label ?? 'Red social';
        const svg = icon?.svg ?? GENERIC_SOCIAL_ICON;
        const href = this.socialHref(link);
        return href
          ? `<a href="${this.escapeHtml(href)}" aria-label="${label}" title="${label}" target="_blank" rel="noopener noreferrer">${svg}</a>`
          : `<span aria-label="${label}" title="${label}">${svg}</span>`;
      })
      .join('');
    return icons ? `<div class="social-links social-links-${placement}">${icons}</div>` : '';
  }

  private socialHref(link: PortfolioSocialLink): string {
    const value = link.href.trim();
    if (link.id === 'whatsapp' && /^\+?[\d\s().-]{7,20}$/.test(value)) {
      const phone = value.replace(/\D/g, '');
      return phone.length >= 7 && phone.length <= 15 ? `https://wa.me/${phone}` : '';
    }
    return this.safeHref(value) ? value : '';
  }

  private projectCss(
    project: PortfolioProject,
    index: number,
    sectionColors?: SectionColors,
  ): string {
    const id = this.safeId(project.id, `project-${index + 1}`);
    const styles = project.styles;
    const defaultCardColor = styles.cardBgColor.toLowerCase() === '#ffffff';
    const cardBgColor = defaultCardColor
      ? this.safeColor(sectionColors?.cardBgColor ?? styles.cardBgColor, '#ffffff')
      : this.safeColor(styles.cardBgColor, '#ffffff');
    const titleColor =
      styles.titleColor.toLowerCase() === '#20202a'
        ? this.safeColor(sectionColors?.textColor ?? styles.titleColor, '#20202a')
        : this.safeColor(styles.titleColor, '#20202a');
    const descriptionColor =
      styles.descriptionColor.toLowerCase() === '#626273'
        ? this.safeColor(sectionColors?.textColor ?? styles.descriptionColor, '#626273')
        : this.safeColor(styles.descriptionColor, '#626273');
    const buttonBgColor =
      styles.buttonBgColor.toLowerCase() === '#6c63ff'
        ? this.safeColor(sectionColors?.accentColor ?? styles.buttonBgColor, '#6c63ff')
        : this.safeColor(styles.buttonBgColor, '#6c63ff');
    const borderColor =
      styles.borderColor.toLowerCase() === '#e4e4eb'
        ? this.safeColor(sectionColors?.accentColor ?? styles.borderColor, '#e4e4eb')
        : this.safeColor(styles.borderColor, '#e4e4eb');
    return `#${id} { background-color: ${cardBgColor}; border-color: ${borderColor}; }
#${id} .project-description { color: ${descriptionColor}; }
#${id} .project-title { color: ${titleColor}; }
#${id} .btn-view { background-color: ${buttonBgColor}; color: ${this.safeColor(styles.buttonTextColor, '#ffffff')}; }`;
  }

  private sectionCss(section: PortfolioSection): string {
    const { colors } = section;
    const bgColor = this.safeColor(colors?.bgColor ?? '', '#f4f5f9');
    const textColor = this.safeColor(colors?.textColor ?? '', '#252532');
    const accentColor = this.safeColor(colors?.accentColor ?? '', '#6c63ff');
    const cardBgColor = this.safeColor(colors?.cardBgColor ?? '', '#ffffff');
    const selector = `.section-${section.type}`;
    const internalCards =
      section.type === 'horizontal-cards' || section.type === 'reviews'
        ? `\n${selector} .horizontal-card, ${selector} .review-card { background-color: var(--section-card-bg-color); border-color: var(--section-accent-color); }\n${selector} .horizontal-card-content p, ${selector} .review-card p, ${selector} .review-role { color: var(--section-text-color); }\n${selector} .rating-track span { background-color: var(--section-accent-color); }`
        : '';
    const projectCards =
      section.type === 'projects'
        ? `\n${selector} .project-card { border-color: var(--section-accent-color); }\n${selector} .project-badge { background-color: var(--section-accent-color); }`
        : '';
    const skills =
      section.type === 'skills'
        ? `\n${selector} .skills-list span { background-color: var(--section-card-bg-color); border-color: var(--section-accent-color); color: var(--section-text-color); }`
        : '';
    const heroColors =
      section.type === 'hero'
        ? `\n${selector} #profile-banner { background-color: var(--section-bg-color); color: var(--section-text-color); }\n${selector} #profile-bio { color: var(--section-text-color); }\n${selector} #profile-role, ${selector} .social-links a, ${selector} .social-links span { color: var(--section-accent-color); }`
        : '';
    return `${selector} { --section-bg-color: ${bgColor}; --section-text-color: ${textColor}; --section-accent-color: ${accentColor}; --section-card-bg-color: ${cardBgColor}; background-color: var(--section-bg-color); color: var(--section-text-color); }
${selector} a { color: var(--section-accent-color); }${internalCards}${projectCards}${skills}${heroColors}`;
  }

  private sectionAnimationCss(sections: PortfolioSection[]): string {
    return sections
      .map((section) => {
        const animation = this.validAnimation(section.animation.type);
        if (animation === 'none') {
          return '';
        }
        const id = this.safeId(section.id, `section-${section.type}`);
        return `[data-section-id="${id}"] { animation-duration: ${this.safeNumber(section.animation.duration, 1, 0, 60)}s; animation-delay: ${this.safeNumber(section.animation.delay, 0, 0, 60)}s; }`;
      })
      .filter(Boolean)
      .join('\n');
  }

  private validAnimation(value: AnimationType): AnimationType {
    return ANIMATION_TYPES.includes(value) ? value : 'none';
  }

  private validPreloaderStyle(value: string): (typeof PRELOADER_STYLES)[number] {
    return PRELOADER_STYLES.includes(value as (typeof PRELOADER_STYLES)[number])
      ? (value as (typeof PRELOADER_STYLES)[number])
      : 'spinner';
  }

  private validHeroLayout(value: HeroLayout): HeroLayout {
    return [1, 2, 3, 4, 5].includes(value) ? value : 1;
  }

  private preloaderMarkup(style: string): string {
    switch (this.validPreloaderStyle(style)) {
      case 'pulse':
        return '<i></i><i></i><i></i>';
      case 'bars':
        return '<i></i><i></i><i></i><i></i>';
      case 'spinner':
        return '<span class="preloader-spinner"></span>';
    }
  }

  private sectionAnchor(section: PortfolioSection): string {
    switch (section.type) {
      case 'hero':
        return 'home';
      case 'projects':
        return 'projects';
      case 'contact':
        return 'contact';
      default:
        return this.safeId(section.id, `section-${section.type}`);
    }
  }

  private safeId(value: string, fallback: string): string {
    return /^[a-zA-Z][a-zA-Z\d_-]*$/.test(value) ? value : fallback;
  }

  private safeColor(value: string, fallback: string): string {
    return /^#[\da-f]{3}(?:[\da-f]{3})?$/i.test(value) ? value : fallback;
  }

  private safeFontFamily(value: string): string {
    return /^[\w\s'",-]+$/.test(value) ? value : 'Arial, sans-serif';
  }

  private safeNumber(value: number, fallback: number, min = 0, max = 10000): number {
    return Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;
  }

  private safeOpacity(value: number): number {
    return this.safeNumber(value, 0.25, 0, 1);
  }

  private safeImageUrl(value: string): string {
    const trimmed = value.trim();
    return /^(https:\/\/|data:image\/(?:png|jpeg|gif|webp);base64,)/i.test(trimmed) ? trimmed : '';
  }

  private safeHref(value: string): boolean {
    return /^(https?:|mailto:)/i.test(value.trim());
  }

  private cssString(value: string): string {
    return value
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/[\r\n]/g, '');
  }

  private escapeHtml(value: string): string {
    return value.replace(/[&<>"']/g, (character) => {
      const entities: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      };
      return entities[character];
    });
  }
}
