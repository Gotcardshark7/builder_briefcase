import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { NgClass, NgStyle } from '@angular/common';
import { Component, inject, OnDestroy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ANIMATION_OPTIONS, FONT_OPTIONS } from './models/animations.data';
import { AnimationType } from './models/portfolio.model';
import { Generator } from './services/generator';
import {
  COLOR_PALETTES,
  GENERIC_SOCIAL_ICON,
  HERO_LAYOUT_OPTIONS,
  HorizontalCard,
  HeroLayout,
  PortfolioProject,
  PortfolioRating,
  PortfolioReview,
  PortfolioSection,
  PortfolioPreloader,
  PortfolioSocialLink,
  ProfileStyles,
  ProjectStyles,
  SectionColors,
  SOCIAL_ICON_CATALOG,
  SocialIconId,
  SocialPlacement,
  State,
} from './services/state';

@Component({
  imports: [DragDropModule, FormsModule, NgClass, NgStyle],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnDestroy {
  private readonly state = inject(State);
  private readonly generator = inject(Generator);
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly fontOptions = FONT_OPTIONS;
  protected readonly animationOptions = ANIMATION_OPTIONS;
  protected readonly palettes = COLOR_PALETTES;
  protected readonly heroLayouts = HERO_LAYOUT_OPTIONS;
  protected readonly socialIconCatalog = SOCIAL_ICON_CATALOG;
  protected readonly socialPlacements: { value: SocialPlacement; label: string }[] = [
    { value: 'hero', label: 'Hero' },
    { value: 'contact', label: 'Contacto' },
    { value: 'footer', label: 'Footer' },
  ];
  protected readonly preloaderStyles = [
    { label: 'Spinner', value: 'spinner' },
    { label: 'Pulso', value: 'pulse' },
    { label: 'Barras', value: 'bars' },
  ] as const;
  protected readonly editorTabs = [
    { id: 'style', label: 'Paleta & estilos', icon: '✦' },
    { id: 'profile', label: 'Perfil & Hero', icon: '◉' },
    { id: 'sections', label: 'Secciones', icon: '▦' },
    { id: 'social', label: 'Redes & SVGs', icon: '◎' },
  ] as const;
  protected activeEditorTab: (typeof this.editorTabs)[number]['id'] = 'style';
  protected previewDevice: 'desktop' | 'tablet' | 'mobile' = 'desktop';
  protected exportError = '';
  private readonly replayingSectionId = signal<string | null>(null);
  private animationReplayToken = 0;

  protected get fontFamily(): string {
    return this.state.snapshot.theme.fontFamily;
  }

  protected set fontFamily(fontFamily: string) {
    this.state.updateTheme({ fontFamily });
  }

  protected get primaryColor(): string {
    return this.state.snapshot.theme.primaryColor;
  }

  protected get paletteId(): string {
    return this.state.snapshot.theme.paletteId;
  }

  protected selectPalette(paletteId: string): void {
    this.state.applyPalette(paletteId);
  }

  protected get heroLayout(): HeroLayout {
    return this.state.snapshot.heroLayout;
  }

  protected set heroLayout(heroLayout: HeroLayout) {
    this.state.updateHeroLayout(heroLayout);
  }

  protected selectHeroLayout(heroLayout: HeroLayout): void {
    this.state.updateHeroLayout(heroLayout);
  }

  protected selectEditorTab(tab: (typeof this.editorTabs)[number]['id']): void {
    this.activeEditorTab = tab;
  }

  protected setPreviewDevice(device: 'desktop' | 'tablet' | 'mobile'): void {
    this.previewDevice = device;
  }

  protected set primaryColor(primaryColor: string) {
    this.state.updateTheme({ primaryColor, paletteId: '' });
  }

  protected get bgColor(): string {
    return this.state.snapshot.theme.globalBgColor;
  }

  protected set bgColor(bgColor: string) {
    this.state.updateTheme({ globalBgColor: bgColor, paletteId: '' });
  }

  protected get textColor(): string {
    return this.state.snapshot.theme.textColor;
  }

  protected get profileName(): string {
    return this.state.snapshot.profile.name;
  }

  protected set profileName(name: string) {
    this.state.updateProfile({ name });
  }

  protected get profileRole(): string {
    return this.state.snapshot.profile.role;
  }

  protected set profileRole(role: string) {
    this.state.updateProfile({ role });
  }

  protected get profileBio(): string {
    return this.state.snapshot.profile.bio;
  }

  protected set profileBio(bio: string) {
    this.state.updateProfile({ bio });
  }

  protected get bannerUrl(): string {
    return this.state.snapshot.profile.bannerUrl;
  }

  protected set bannerUrl(bannerUrl: string) {
    this.state.updateProfile({ bannerUrl });
  }

  protected get profileStyles(): ProfileStyles {
    return this.state.snapshot.profile.styles;
  }

  protected get preloader(): PortfolioPreloader {
    return this.state.snapshot.preloader;
  }

  protected updatePreloader(changes: Partial<PortfolioPreloader>): void {
    this.state.updatePreloader(changes);
  }

  protected get avatarUrl(): string {
    return this.state.snapshot.profile.avatarUrl;
  }

  protected get sections(): PortfolioSection[] {
    return this.state.snapshot.sections;
  }

  protected get userProjects(): PortfolioProject[] {
    return this.state.snapshot.projects;
  }

  protected get horizontalCards(): HorizontalCard[] {
    return this.state.snapshot.horizontalCards;
  }

  protected get reviews(): PortfolioReview[] {
    return this.state.snapshot.reviews;
  }

  protected get ratings(): PortfolioRating[] {
    return this.state.snapshot.ratings;
  }

  protected get socialLinks(): PortfolioSocialLink[] {
    return this.state.snapshot.socialLinks;
  }

  protected addHorizontalCard(): void {
    this.state.addHorizontalCard();
  }

  protected updateHorizontalCard(
    cardId: string,
    changes: Partial<Omit<HorizontalCard, 'id'>>,
  ): void {
    this.state.updateHorizontalCard(cardId, changes);
  }

  protected removeHorizontalCard(cardId: string): void {
    this.state.removeHorizontalCard(cardId);
  }

  protected addReview(): void {
    this.state.addReview();
  }

  protected updateReview(reviewId: string, changes: Partial<Omit<PortfolioReview, 'id'>>): void {
    this.state.updateReview(reviewId, changes);
  }

  protected removeReview(reviewId: string): void {
    this.state.removeReview(reviewId);
  }

  protected addRating(): void {
    this.state.addRating();
  }

  protected updateRating(ratingId: string, changes: Partial<Omit<PortfolioRating, 'id'>>): void {
    this.state.updateRating(ratingId, changes);
  }

  protected removeRating(ratingId: string): void {
    this.state.removeRating(ratingId);
  }

  protected addSocialLink(iconId: SocialIconId): void {
    this.state.addSocialLink(iconId);
  }

  protected updateSocialLink(iconId: SocialIconId, href: string): void {
    this.state.updateSocialLink(iconId, href);
  }

  protected updateSocialLinkPlacement(iconId: SocialIconId, placement: SocialPlacement): void {
    this.state.updateSocialLinkPlacement(iconId, placement);
  }

  protected removeSocialLink(iconId: SocialIconId): void {
    this.state.removeSocialLink(iconId);
  }

  protected socialLabel(iconId: SocialIconId): string {
    return this.socialIconCatalog.find((icon) => icon.id === iconId)?.label ?? iconId;
  }

  protected hasSocialLink(iconId: SocialIconId): boolean {
    return this.socialLinks.some((link) => link.id === iconId);
  }

  protected hasSocialPlacement(placement: SocialPlacement): boolean {
    return this.socialLinks.some((link) => link.placement === placement);
  }

  protected socialSvg(iconId: SocialIconId): SafeHtml {
    const svg =
      this.socialIconCatalog.find((icon) => icon.id === iconId)?.svg ?? GENERIC_SOCIAL_ICON;
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  protected socialHref(link: PortfolioSocialLink): string {
    const trimmed = link.href.trim();
    if (link.id === 'whatsapp' && /^\+?[\d\s().-]{7,20}$/.test(trimmed)) {
      const phone = trimmed.replace(/\D/g, '');
      return phone.length >= 7 && phone.length <= 15 ? `https://wa.me/${phone}` : '#';
    }
    return this.projectHref(trimmed);
  }

  protected socialPlaceholder(iconId: SocialIconId): string {
    return iconId === 'whatsapp' ? 'URL o número con código de país' : 'https://...';
  }

  protected sectionColorStyles(section: PortfolioSection): Record<string, string> {
    return {
      'background-color': section.colors.bgColor,
      color: section.colors.textColor,
      '--section-bg-color': section.colors.bgColor,
      '--section-text-color': section.colors.textColor,
      '--section-accent-color': section.colors.accentColor,
      '--section-card-bg-color': section.colors.cardBgColor,
    };
  }

  protected updateSectionColors(sectionId: string, colors: Partial<SectionColors>): void {
    this.state.updateSectionColors(sectionId, colors);
  }

  protected projectCardBackground(project: PortfolioProject, section: PortfolioSection): string {
    return project.styles.cardBgColor.toLowerCase() === '#ffffff'
      ? section.colors.cardBgColor
      : project.styles.cardBgColor;
  }

  protected projectTitleColor(project: PortfolioProject, section: PortfolioSection): string {
    return project.styles.titleColor.toLowerCase() === '#20202a'
      ? section.colors.textColor
      : project.styles.titleColor;
  }

  protected projectDescriptionColor(project: PortfolioProject, section: PortfolioSection): string {
    return project.styles.descriptionColor.toLowerCase() === '#626273'
      ? section.colors.textColor
      : project.styles.descriptionColor;
  }

  protected projectButtonColor(project: PortfolioProject, section: PortfolioSection): string {
    return project.styles.buttonBgColor.toLowerCase() === '#6c63ff'
      ? section.colors.accentColor
      : project.styles.buttonBgColor;
  }

  protected projectBorderColor(project: PortfolioProject, section: PortfolioSection): string {
    return project.styles.borderColor.toLowerCase() === '#e4e4eb'
      ? section.colors.accentColor
      : project.styles.borderColor;
  }

  protected ratingStars(rating: number): string {
    return (
      '★'.repeat(Math.max(0, Math.min(5, Math.round(rating)))) +
      '☆'.repeat(5 - Math.max(0, Math.min(5, Math.round(rating))))
    );
  }

  protected drop(event: CdkDragDrop<PortfolioSection[]>): void {
    this.state.reorderSections(event.previousIndex, event.currentIndex);
  }

  protected addProject(): void {
    this.state.addProject();
  }

  protected removeProject(projectId: string): void {
    this.state.removeProject(projectId);
  }

  protected updateProject(
    projectId: string,
    changes: Partial<Omit<PortfolioProject, 'id' | 'styles'>>,
  ): void {
    this.state.updateProject(projectId, changes);
  }

  protected updateProfileStyles(styles: Partial<ProfileStyles>): void {
    this.state.updateProfileStyles(styles);
  }

  protected updateProjectStyles(projectId: string, styles: Partial<ProjectStyles>): void {
    this.state.updateProjectStyles(projectId, styles);
  }

  protected updateSectionAnimation(sectionId: string, type: AnimationType): void {
    this.state.updateSectionAnimation(sectionId, { type });
    const token = ++this.animationReplayToken;
    this.replayingSectionId.set(null);
    setTimeout(() => {
      if (token === this.animationReplayToken) {
        this.replayingSectionId.set(sectionId);
      }
    }, 20);
  }

  protected previewAnimationClasses(section: PortfolioSection): Record<string, boolean> {
    return {
      animate__animated:
        section.animation.type !== 'none' && this.replayingSectionId() === section.id,
      [`animate__${section.animation.type}`]:
        section.animation.type !== 'none' && this.replayingSectionId() === section.id,
    };
  }

  protected updateSectionVisibility(section: PortfolioSection, visible: boolean): void {
    this.state.updateSectionVisibility(section.id, visible);
  }

  protected onFileSelected(
    event: Event,
    targetType: 'avatar' | 'banner' | 'project',
    id?: string,
  ): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);
    if (!allowedTypes.has(file.type)) {
      this.exportError = 'Selecciona una imagen PNG, JPEG, GIF o WebP.';
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (
        typeof reader.result !== 'string' ||
        !/^data:image\/(?:png|jpeg|gif|webp);base64,/i.test(reader.result)
      ) {
        this.exportError = 'No se pudo cargar la imagen seleccionada.';
        return;
      }
      if (targetType === 'avatar') {
        this.state.updateProfile({ avatarUrl: reader.result });
      } else if (targetType === 'banner') {
        this.state.updateProfile({ bannerUrl: reader.result });
      } else if (id) {
        this.state.updateProject(id, { imageUrl: reader.result });
      } else {
        this.exportError = 'No se pudo identificar el proyecto de destino.';
        return;
      }
      this.exportError = '';
    };
    reader.onerror = () => {
      this.exportError = 'No se pudo leer la imagen seleccionada.';
    };
    reader.readAsDataURL(file);
  }

  ngOnDestroy(): void {
    this.animationReplayToken++;
  }

  protected async exportarPortfolio(): Promise<void> {
    this.exportError = '';
    try {
      await this.generator.exportPortfolio(this.state.snapshot);
    } catch (error) {
      console.error('No se pudo exportar el portfolio.', error);
      this.exportError = 'No se pudo generar el ZIP. Inténtalo de nuevo.';
    }
  }

  protected projectHref(link: string): string {
    const trimmedLink = link.trim();
    return /^(https?:|mailto:)/i.test(trimmedLink) ? trimmedLink : '#';
  }

  protected hasSection(type: PortfolioSection['type']): boolean {
    return this.sections.some((section) => section.type === type && section.visible);
  }
}
