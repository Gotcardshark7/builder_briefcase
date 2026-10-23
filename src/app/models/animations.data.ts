import { AnimationType } from './portfolio.model';

export const ANIMATION_OPTIONS: {
  label: string;
  value: AnimationType;
}[] = [
  { label: 'Ninguna', value: 'none' },
  { label: 'Aparecer', value: 'fadeIn' },
  { label: 'Aparecer desde arriba', value: 'fadeInDown' },
  { label: 'Aparecer desde abajo', value: 'fadeInUp' },
  { label: 'Zoom', value: 'zoomIn' },
  { label: 'Rebote', value: 'bounceIn' },
  { label: 'Deslizar desde la izquierda', value: 'slideInLeft' },
  { label: 'Deslizar desde la derecha', value: 'slideInRight' },
  { label: 'Pulso', value: 'pulse' },
  { label: 'Banda elástica', value: 'rubberBand' },
];

export const FONT_OPTIONS = [
  { label: 'Inter', value: 'Inter, sans-serif' },
  { label: 'Montserrat', value: 'Montserrat, sans-serif' },
  { label: 'Roboto', value: 'Roboto, sans-serif' },
  { label: 'Playfair Display', value: '"Playfair Display", serif' },
  { label: 'Fira Code', value: '"Fira Code", monospace' },
  { label: 'Outfit', value: 'Outfit, sans-serif' },
  { label: 'Poppins', value: 'Poppins, sans-serif' },
];
