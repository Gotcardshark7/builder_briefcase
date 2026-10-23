import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AnimationType } from '../models/portfolio.model';
import { FONT_OPTIONS } from '../models/animations.data';

export type PortfolioSectionType =
  'nav' | 'hero' | 'projects' | 'skills' | 'contact' | 'horizontal-cards' | 'reviews';
export type HeroLayout = 1 | 2 | 3 | 4 | 5;

export const HERO_LAYOUT_OPTIONS: { label: string; value: HeroLayout }[] = [
  { label: '1 · Banner full-width', value: 1 },
  { label: '2 · Clásico tipográfico', value: 2 },
  { label: '3 · Perfil social', value: 3 },
  { label: '4 · Split de 2 columnas', value: 4 },
  { label: '5 · Glassmorphism central', value: 5 },
];

export const COLOR_PALETTES = [
  {
    id: 'dark-cyber',
    name: 'Dark Cyber',
    primaryColor: '#8b5cf6',
    globalBgColor: '#111827',
    textColor: '#f9fafb',
    nameColor: '#f9fafb',
    roleColor: '#a78bfa',
    bioColor: '#d1d5db',
    sectionBgColor: '#111827',
    sectionTextColor: '#f9fafb',
    accentColor: '#a78bfa',
    cardBgColor: '#1f2937',
  },
  {
    id: 'clean-tech',
    name: 'Clean Tech',
    primaryColor: '#0f766e',
    globalBgColor: '#f0fdfa',
    textColor: '#134e4a',
    nameColor: '#134e4a',
    roleColor: '#0f766e',
    bioColor: '#475569',
    sectionBgColor: '#f0fdfa',
    sectionTextColor: '#134e4a',
    accentColor: '#0f766e',
    cardBgColor: '#ffffff',
  },
  {
    id: 'sunset',
    name: 'Sunset',
    primaryColor: '#ea580c',
    globalBgColor: '#fff7ed',
    textColor: '#431407',
    nameColor: '#431407',
    roleColor: '#c2410c',
    bioColor: '#7c2d12',
    sectionBgColor: '#fff7ed',
    sectionTextColor: '#431407',
    accentColor: '#c2410c',
    cardBgColor: '#ffffff',
  },
  {
    id: 'pastel-modern',
    name: 'Pastel Modern',
    primaryColor: '#8b5cf6',
    globalBgColor: '#faf5ff',
    textColor: '#312e81',
    nameColor: '#312e81',
    roleColor: '#7c3aed',
    bioColor: '#5b556f',
    sectionBgColor: '#faf5ff',
    sectionTextColor: '#312e81',
    accentColor: '#7c3aed',
    cardBgColor: '#ffffff',
  },
  {
    id: 'pastel-red',
    name: 'Rojo Pastel',
    primaryColor: '#be123c',
    globalBgColor: '#fff1f2',
    textColor: '#881337',
    nameColor: '#881337',
    roleColor: '#9f1239',
    bioColor: '#4c0519',
    sectionBgColor: '#fff1f2',
    sectionTextColor: '#881337',
    accentColor: '#be123c',
    cardBgColor: '#fffafb',
  },
  {
    id: 'pastel-orange',
    name: 'Naranja Pastel',
    primaryColor: '#c2410c',
    globalBgColor: '#fff7ed',
    textColor: '#7c2d12',
    nameColor: '#7c2d12',
    roleColor: '#9a3412',
    bioColor: '#431407',
    sectionBgColor: '#fff7ed',
    sectionTextColor: '#7c2d12',
    accentColor: '#c2410c',
    cardBgColor: '#fffdf9',
  },
  {
    id: 'pastel-yellow',
    name: 'Amarillo Pastel',
    primaryColor: '#854d0e',
    globalBgColor: '#fefce8',
    textColor: '#422006',
    nameColor: '#422006',
    roleColor: '#713f12',
    bioColor: '#422006',
    sectionBgColor: '#fefce8',
    sectionTextColor: '#422006',
    accentColor: '#854d0e',
    cardBgColor: '#fffef7',
  },
  {
    id: 'pastel-green',
    name: 'Verde Pastel',
    primaryColor: '#047857',
    globalBgColor: '#ecfdf5',
    textColor: '#064e3b',
    nameColor: '#064e3b',
    roleColor: '#065f46',
    bioColor: '#022c22',
    sectionBgColor: '#ecfdf5',
    sectionTextColor: '#064e3b',
    accentColor: '#047857',
    cardBgColor: '#f7fffb',
  },
  {
    id: 'pastel-blue',
    name: 'Azul Pastel',
    primaryColor: '#1d4ed8',
    globalBgColor: '#eff6ff',
    textColor: '#1e3a8a',
    nameColor: '#1e3a8a',
    roleColor: '#1e40af',
    bioColor: '#172554',
    sectionBgColor: '#eff6ff',
    sectionTextColor: '#1e3a8a',
    accentColor: '#1d4ed8',
    cardBgColor: '#f8fbff',
  },
  {
    id: 'pastel-lavender',
    name: 'Violeta / Lavanda',
    primaryColor: '#6d28d9',
    globalBgColor: '#f5f3ff',
    textColor: '#3b0764',
    nameColor: '#3b0764',
    roleColor: '#581c87',
    bioColor: '#2e1065',
    sectionBgColor: '#f5f3ff',
    sectionTextColor: '#3b0764',
    accentColor: '#6d28d9',
    cardBgColor: '#fcfbff',
  },
  {
    id: 'neutral-minimal',
    name: 'Neutro / Minimalista',
    primaryColor: '#57534e',
    globalBgColor: '#f5f5f4',
    textColor: '#292524',
    nameColor: '#292524',
    roleColor: '#44403c',
    bioColor: '#292524',
    sectionBgColor: '#f5f5f4',
    sectionTextColor: '#292524',
    accentColor: '#57534e',
    cardBgColor: '#ffffff',
  },
  {
    id: 'tech-bootstrap',
    name: 'Bootstrap · Purple Tech',
    primaryColor: '#7952b3',
    globalBgColor: '#212529',
    textColor: '#f8f9fa',
    nameColor: '#f8f9fa',
    roleColor: '#e0cffc',
    bioColor: '#dee2e6',
    sectionBgColor: '#2b3035',
    sectionTextColor: '#f8f9fa',
    accentColor: '#7952b3',
    cardBgColor: '#212529',
  },
  {
    id: 'tech-ubuntu',
    name: 'Ubuntu · Aubergine & Orange',
    primaryColor: '#E95420',
    globalBgColor: '#300A24',
    textColor: '#f8f9fa',
    nameColor: '#f8f9fa',
    roleColor: '#f9c8b7',
    bioColor: '#e9dce5',
    sectionBgColor: '#111111',
    sectionTextColor: '#f8f9fa',
    accentColor: '#E95420',
    cardBgColor: '#300A24',
  },
  {
    id: 'tech-angular',
    name: 'Angular · Crimson Dark',
    primaryColor: '#DD0031',
    globalBgColor: '#0f172a',
    textColor: '#f8fafc',
    nameColor: '#f8fafc',
    roleColor: '#fca5a5',
    bioColor: '#e2e8f0',
    sectionBgColor: '#1e1e24',
    sectionTextColor: '#f8fafc',
    accentColor: '#C3002F',
    cardBgColor: '#0f172a',
  },
  {
    id: 'tech-react',
    name: 'React · Cyan Cyber',
    primaryColor: '#61DAFB',
    globalBgColor: '#20232a',
    textColor: '#f8fafc',
    nameColor: '#f8fafc',
    roleColor: '#a5f3fc',
    bioColor: '#d1d5db',
    sectionBgColor: '#282c34',
    sectionTextColor: '#f8fafc',
    accentColor: '#61DAFB',
    cardBgColor: '#20232a',
  },
] as const;

export const GENERIC_SOCIAL_ICON =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8 12h8M12 8v8"/></svg>';

export const SOCIAL_ICON_CATALOG = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.8a8 8 0 0 1-11.8 7l-4.2 1.1 1.1-4.1A8 8 0 1 1 20 11.8Z"/><path d="M9 8.5c.4 2.4 2 4 4.5 4.8l1.2-1.2 2 1c-.2 1.4-1.2 2.2-2.6 2.1-3.6-.5-6.4-3.3-6.9-6.9-.1-1.4.7-2.4 2.1-2.6l1 2L9 8.5Z"/></svg>',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/></svg>',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 21v-8h3l.5-4H14V7c0-1.2.4-2 2-2h2V1.5c-.8-.1-1.8-.2-3-.2-3 0-5 1.8-5 5.2V9H7v4h3v8h4Z"/></svg>',
  },
  {
    id: 'github',
    label: 'GitHub',
    svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 19c-4.3 1.3-4.3-2.2-6-2.5M15 21v-3.5c0-1 .1-1.5-.5-2 3.3-.4 6.5-1.6 6.5-7A5.5 5.5 0 0 0 19.5 4 5 5 0 0 0 19.4.5S18.2.1 15 2.3a13 13 0 0 0-7 0C4.8.1 3.6.5 3.6.5A5 5 0 0 0 3.5 4 5.5 5.5 0 0 0 2 8.5c0 5.4 3.2 6.6 6.5 7-.6.5-.6 1.2-.5 2V21"/></svg>',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9v10M5 5v.01M10 19v-6a4 4 0 0 1 8 0v6M10 9v10"/></svg>',
  },
  {
    id: 'x',
    label: 'X',
    svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 4 16 16M20 4 4 20"/></svg>',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3v11.5a4 4 0 1 1-4-4M14 3c.5 3 2.5 5 6 5"/></svg>',
  },
] as const;
export const SOCIAL_ICONS = SOCIAL_ICON_CATALOG;

export type SocialIconId = (typeof SOCIAL_ICON_CATALOG)[number]['id'];
export type SocialPlacement = 'hero' | 'contact' | 'footer';

export interface PortfolioSocialLink {
  id: SocialIconId;
  href: string;
  placement: SocialPlacement;
}

export interface HorizontalCard {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  buttonLabel: string;
}

export interface PortfolioReview {
  id: string;
  name: string;
  role: string;
  comment: string;
  rating: number;
}

export interface PortfolioRating {
  id: string;
  label: string;
  level: number;
}

export interface SectionAnimation {
  type: AnimationType;
  duration: number;
  delay: number;
}

export interface PortfolioSection {
  id: string;
  type: PortfolioSectionType;
  title: string;
  visible: boolean;
  animation: SectionAnimation;
  colors: SectionColors;
}

export interface SectionColors {
  bgColor: string;
  textColor: string;
  accentColor: string;
  cardBgColor: string;
}

type Palette = (typeof COLOR_PALETTES)[number];

const sectionColorsForPalette = (palette: Palette): SectionColors => ({
  bgColor: palette.sectionBgColor,
  textColor: palette.sectionTextColor,
  accentColor: palette.accentColor,
  cardBgColor: palette.cardBgColor,
});

export interface ProfileStyles {
  nameColor: string;
  roleColor: string;
  bioColor: string;
  heroTitleSize: number;
  heroSubtitleSize: number;
  heroBioSize: number;
  heroButtonSize: number;
  bannerHeight: number;
  avatarSize: number;
  overlayOpacity: number;
}

export interface ProfileState {
  name: string;
  role: string;
  bio: string;
  avatarUrl: string;
  bannerUrl: string;
  styles: ProfileStyles;
}

export interface ProjectStyles {
  cardBgColor: string;
  titleColor: string;
  descriptionColor: string;
  buttonBgColor: string;
  buttonTextColor: string;
  borderColor: string;
  badgeText: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  link: string;
  imageUrl: string;
  featured: boolean;
  styles: ProjectStyles;
}

export interface PortfolioState {
  theme: {
    fontFamily: string;
    globalBgColor: string;
    primaryColor: string;
    textColor: string;
    paletteId: string;
  };
  heroLayout: HeroLayout;
  profile: ProfileState;
  sections: PortfolioSection[];
  projects: PortfolioProject[];
  horizontalCards: HorizontalCard[];
  reviews: PortfolioReview[];
  ratings: PortfolioRating[];
  socialLinks: PortfolioSocialLink[];
  preloader: PortfolioPreloader;
}

export type PreloaderStyle = 'spinner' | 'pulse' | 'bars';

export interface PortfolioPreloader {
  enabled: boolean;
  style: PreloaderStyle;
  text: string;
  bgColor: string;
  textColor: string;
}

const defaultAnimation: SectionAnimation = {
  type: 'none',
  duration: 1,
  delay: 0,
};

const defaultProjectStyles: ProjectStyles = {
  cardBgColor: '#ffffff',
  titleColor: '#20202a',
  descriptionColor: '#626273',
  buttonBgColor: '#6c63ff',
  buttonTextColor: '#ffffff',
  borderColor: '#e4e4eb',
  badgeText: '',
};

const createSection = (
  id: string,
  type: PortfolioSectionType,
  title: string,
  colors: SectionColors = {
    bgColor: '#f4f5f9',
    textColor: '#252532',
    accentColor: '#6c63ff',
    cardBgColor: '#ffffff',
  },
): PortfolioSection => ({
  id,
  type,
  title,
  visible: true,
  animation: { ...defaultAnimation },
  colors: { ...colors },
});

const createProject = (id: string): PortfolioProject => ({
  id,
  title: '',
  description: '',
  link: '',
  imageUrl: '',
  featured: false,
  styles: { ...defaultProjectStyles },
});

const createHorizontalCard = (id: string): HorizontalCard => ({
  id,
  title: '',
  description: '',
  imageUrl: '',
  link: '',
  buttonLabel: 'Ver más',
});

const createReview = (id: string): PortfolioReview => ({
  id,
  name: '',
  role: '',
  comment: '',
  rating: 5,
});

const createRating = (id: string): PortfolioRating => ({ id, label: '', level: 80 });

const createInitialState = (): PortfolioState => ({
  theme: {
    fontFamily: FONT_OPTIONS[0].value,
    globalBgColor: '#f4f5f9',
    primaryColor: '#6c63ff',
    textColor: '#252532',
    paletteId: '',
  },
  heroLayout: 1,
  profile: {
    name: 'Alex Morgan',
    role: 'Diseñador/a digital & desarrollador/a',
    bio: 'Creo experiencias digitales cuidadas, accesibles y fáciles de usar.',
    avatarUrl: '',
    bannerUrl: '',
    styles: {
      nameColor: '#ffffff',
      roleColor: '#ffffff',
      bioColor: '#f2f2f7',
      heroTitleSize: 3,
      heroSubtitleSize: 1.5,
      heroBioSize: 1.1,
      heroButtonSize: 1,
      bannerHeight: 280,
      avatarSize: 112,
      overlayOpacity: 0.5,
    },
  },
  sections: [
    createSection('nav', 'nav', 'Navegación'),
    createSection('hero', 'hero', 'Presentación', {
      bgColor: '#252532',
      textColor: '#ffffff',
      accentColor: '#a78bfa',
      cardBgColor: '#ffffff',
    }),
    createSection('projects', 'projects', 'Proyectos'),
    createSection('skills', 'skills', 'Habilidades'),
    createSection('contact', 'contact', 'Contacto'),
    createSection('horizontal-cards', 'horizontal-cards', 'Tarjetas horizontales'),
    createSection('reviews', 'reviews', 'Reviews'),
  ],
  projects: [
    {
      ...createProject('proj-1'),
      title: 'Proyecto destacado',
      description: 'Una breve descripción de este proyecto.',
      link: 'https://example.com',
    },
  ],
  horizontalCards: [
    {
      ...createHorizontalCard('card-1'),
      title: 'Un proyecto especial',
      description: 'Destaca una experiencia, servicio o colaboración importante.',
    },
  ],
  reviews: [
    {
      ...createReview('review-1'),
      name: 'Cliente satisfecho',
      comment: 'Una experiencia excelente.',
    },
  ],
  ratings: [
    { ...createRating('rating-1'), label: 'Diseño de producto', level: 90 },
    { ...createRating('rating-2'), label: 'Desarrollo web', level: 85 },
  ],
  socialLinks: [],
  preloader: {
    enabled: true,
    style: 'spinner',
    text: 'Cargando portfolio...',
    bgColor: '#ffffff',
    textColor: '#20202a',
  },
});

@Injectable({ providedIn: 'root' })
export class State {
  private readonly portfolioSubject = new BehaviorSubject<PortfolioState>(createInitialState());
  private nextProjectId = 2;
  private nextCardId = 2;
  private nextReviewId = 2;
  private nextRatingId = 3;

  readonly state$ = this.portfolioSubject.asObservable();

  get snapshot(): PortfolioState {
    return this.portfolioSubject.value;
  }

  updateTheme(theme: Partial<PortfolioState['theme']>): void {
    this.update({ theme: { ...this.snapshot.theme, ...theme } });
  }

  applyPalette(paletteId: string): void {
    if (!paletteId) {
      this.updateTheme({ paletteId: '' });
      return;
    }
    const palette = COLOR_PALETTES.find((item) => item.id === paletteId);
    if (!palette) {
      return;
    }
    this.update({
      theme: {
        ...this.snapshot.theme,
        primaryColor: palette.primaryColor,
        globalBgColor: palette.globalBgColor,
        textColor: palette.textColor,
        paletteId: palette.id,
      },
      profile: {
        ...this.snapshot.profile,
        styles: {
          ...this.snapshot.profile.styles,
          nameColor: palette.nameColor,
          roleColor: palette.roleColor,
          bioColor: palette.bioColor,
        },
      },
      sections: this.snapshot.sections.map((section) => ({
        ...section,
        colors: sectionColorsForPalette(palette),
      })),
    });
  }

  updateHeroLayout(heroLayout: HeroLayout): void {
    this.update({ heroLayout });
  }

  updatePreloader(preloader: Partial<PortfolioPreloader>): void {
    this.update({ preloader: { ...this.snapshot.preloader, ...preloader } });
  }

  updateProfile(profile: Partial<Omit<ProfileState, 'styles'>>): void {
    this.update({ profile: { ...this.snapshot.profile, ...profile } });
  }

  updateProfileStyles(styles: Partial<ProfileStyles>): void {
    this.update({
      theme: { ...this.snapshot.theme, paletteId: '' },
      profile: {
        ...this.snapshot.profile,
        styles: { ...this.snapshot.profile.styles, ...styles },
      },
    });
  }

  addProject(project?: Partial<PortfolioProject>): void {
    const id = this.createProjectId();
    const newProject = {
      ...createProject(id),
      ...project,
      id,
      styles: { ...defaultProjectStyles, ...project?.styles },
    };
    this.update({ projects: [...this.snapshot.projects, newProject] });
  }

  removeProject(projectId: string): void {
    this.update({
      projects: this.snapshot.projects.filter((project) => project.id !== projectId),
    });
  }

  addHorizontalCard(card?: Partial<HorizontalCard>): void {
    const id = `card-${this.nextCardId++}`;
    this.update({
      horizontalCards: [
        ...this.snapshot.horizontalCards,
        { ...createHorizontalCard(id), ...card, id },
      ],
    });
  }

  updateHorizontalCard(cardId: string, changes: Partial<Omit<HorizontalCard, 'id'>>): void {
    this.update({
      horizontalCards: this.snapshot.horizontalCards.map((card) =>
        card.id === cardId ? { ...card, ...changes } : card,
      ),
    });
  }

  removeHorizontalCard(cardId: string): void {
    this.update({
      horizontalCards: this.snapshot.horizontalCards.filter((card) => card.id !== cardId),
    });
  }

  addReview(review?: Partial<PortfolioReview>): void {
    const id = `review-${this.nextReviewId++}`;
    const rating = review?.rating;
    const normalizedRating =
      rating === undefined
        ? 5
        : Number.isFinite(rating)
          ? Math.min(5, Math.max(0, Math.round(rating)))
          : 0;
    this.update({
      reviews: [
        ...this.snapshot.reviews,
        { ...createReview(id), ...review, rating: normalizedRating, id },
      ],
    });
  }

  updateReview(reviewId: string, changes: Partial<Omit<PortfolioReview, 'id'>>): void {
    const normalizedChanges =
      changes.rating === undefined
        ? changes
        : {
            ...changes,
            rating: Number.isFinite(changes.rating)
              ? Math.min(5, Math.max(0, Math.round(changes.rating)))
              : 0,
          };
    this.update({
      reviews: this.snapshot.reviews.map((review) =>
        review.id === reviewId ? { ...review, ...normalizedChanges } : review,
      ),
    });
  }

  removeReview(reviewId: string): void {
    this.update({ reviews: this.snapshot.reviews.filter((review) => review.id !== reviewId) });
  }

  addRating(rating?: Partial<PortfolioRating>): void {
    const id = `rating-${this.nextRatingId++}`;
    const level = rating?.level;
    const normalizedLevel =
      level === undefined ? 80 : Number.isFinite(level) ? Math.min(100, Math.max(0, level)) : 0;
    this.update({
      ratings: [
        ...this.snapshot.ratings,
        { ...createRating(id), ...rating, level: normalizedLevel, id },
      ],
    });
  }

  updateRating(ratingId: string, changes: Partial<Omit<PortfolioRating, 'id'>>): void {
    const normalizedChanges =
      changes.level === undefined
        ? changes
        : {
            ...changes,
            level: Number.isFinite(changes.level) ? Math.min(100, Math.max(0, changes.level)) : 0,
          };
    this.update({
      ratings: this.snapshot.ratings.map((rating) =>
        rating.id === ratingId ? { ...rating, ...normalizedChanges } : rating,
      ),
    });
  }

  removeRating(ratingId: string): void {
    this.update({ ratings: this.snapshot.ratings.filter((rating) => rating.id !== ratingId) });
  }

  addSocialLink(id: SocialIconId, placement: SocialPlacement = 'hero'): void {
    if (this.snapshot.socialLinks.some((link) => link.id === id)) {
      return;
    }
    this.update({ socialLinks: [...this.snapshot.socialLinks, { id, href: '', placement }] });
  }

  updateSocialLink(id: SocialIconId, href: string): void {
    this.update({
      socialLinks: this.snapshot.socialLinks.map((link) =>
        link.id === id ? { ...link, href } : link,
      ),
    });
  }

  updateSocialLinkPlacement(id: SocialIconId, placement: SocialPlacement): void {
    this.update({
      socialLinks: this.snapshot.socialLinks.map((link) =>
        link.id === id ? { ...link, placement } : link,
      ),
    });
  }

  removeSocialLink(id: SocialIconId): void {
    this.update({ socialLinks: this.snapshot.socialLinks.filter((link) => link.id !== id) });
  }

  updateProject(
    projectId: string,
    changes: Partial<Omit<PortfolioProject, 'id' | 'styles'>>,
  ): void {
    this.update({
      projects: this.snapshot.projects.map((project) =>
        project.id === projectId ? { ...project, ...changes } : project,
      ),
    });
  }

  updateProjectStyles(projectId: string, styles: Partial<ProjectStyles>): void {
    this.update({
      projects: this.snapshot.projects.map((project) =>
        project.id === projectId
          ? { ...project, styles: { ...project.styles, ...styles } }
          : project,
      ),
    });
  }

  reorderSections(previousIndex: number, currentIndex: number): void {
    const sections = [...this.snapshot.sections];
    if (
      !this.isValidIndex(previousIndex, sections.length) ||
      !this.isValidIndex(currentIndex, sections.length)
    ) {
      return;
    }
    const [section] = sections.splice(previousIndex, 1);
    sections.splice(currentIndex, 0, section);
    this.update({ sections });
  }

  updateSectionAnimation(sectionId: string, animation: Partial<SectionAnimation>): void {
    this.update({
      sections: this.snapshot.sections.map((section) =>
        section.id === sectionId
          ? { ...section, animation: { ...section.animation, ...animation } }
          : section,
      ),
    });
  }

  updateSectionVisibility(sectionId: string, visible: boolean): void {
    this.update({
      sections: this.snapshot.sections.map((section) =>
        section.id === sectionId ? { ...section, visible } : section,
      ),
    });
  }

  updateSectionColors(sectionId: string, colors: Partial<SectionColors>): void {
    this.update({
      sections: this.snapshot.sections.map((section) =>
        section.id === sectionId
          ? { ...section, colors: { ...section.colors, ...colors } }
          : section,
      ),
    });
  }

  private createProjectId(): string {
    const existingIds = new Set(this.snapshot.projects.map((project) => project.id));
    let id: string;
    do {
      id = `proj-${this.nextProjectId++}`;
    } while (existingIds.has(id));
    return id;
  }

  private update(changes: Partial<PortfolioState>): void {
    this.portfolioSubject.next({ ...this.snapshot, ...changes });
  }

  private isValidIndex(index: number, length: number): boolean {
    return Number.isInteger(index) && index >= 0 && index < length;
  }
}
