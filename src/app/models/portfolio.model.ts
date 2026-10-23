export type AnimationType =
  | 'none'
  | 'fadeIn'
  | 'fadeInDown'
  | 'fadeInUp'
  | 'zoomIn'
  | 'bounceIn'
  | 'slideInLeft'
  | 'slideInRight'
  | 'pulse'
  | 'rubberBand';

export interface AnimationConfig {
  entrance: AnimationType;
  hover: AnimationType;
  duration: number;
  delay: number;
}

export interface SectionBlock {
  id: string;
  name: string;
  type: 'nav' | 'hero' | 'projects' | 'skills' | 'contact';
  visible: boolean;
  animation: AnimationConfig;
  content: any;
}

export interface PortfolioState {
  theme: Record<string, unknown>;
  profile: Record<string, unknown>;
  sections: SectionBlock[];
}
