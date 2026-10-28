// Aspecto: temas de color (cielos), colores del pájaro y complementos que se compran con alpiste.
// El pájaro de la jugadora se dibuja aquí con lo que lleve puesto.

import { GLYPHS } from './glyphs.js';

// Temas: el automático usa Amanecer de día y Noche estrellada si el sistema está en modo oscuro.
export const SKINS = [
  { id: 'amanecer', name: 'Amanecer', price: 0, dark: false },
  { id: 'noche', name: 'Noche estrellada', price: 0, dark: true },
  { id: 'jardin', name: 'Jardín', price: 60, dark: false },
  { id: 'oceano', name: 'Océano', price: 60, dark: false },
  { id: 'atardecer', name: 'Atardecer', price: 90, dark: true },
  { id: 'galaxia', name: 'Galaxia', price: 120, dark: true },
];

export const COLORS = [
  { id: 'ultramar', name: 'Ultramar', value: '#2338C4', price: 0 },
  { id: 'chicle', name: 'Chicle', value: '#E0457B', price: 0 },
  { id: 'menta', name: 'Menta', value: '#0F8B6E', price: 0 },
  { id: 'mandarina', name: 'Mandarina', value: '#D9822B', price: 0 },
  { id: 'uva', name: 'Uva', value: '#7A3FC2', price: 0 },
  { id: 'cielo', name: 'Cielo', value: '#1F7FB8', price: 0 },
  { id: 'lavanda', name: 'Lavanda', value: '#9B7BE0', price: 30 },
  { id: 'coral', name: 'Coral', value: '#FF6F61', price: 30 },
  { id: 'turquesa', name: 'Turquesa', value: '#14B8A6', price: 30 },
  { id: 'oro', name: 'Oro', value: '#C9A227', price: 50 },
  { id: 'cereza', name: 'Cereza', value: '#B5174B', price: 50 },
  { id: 'medianoche', name: 'Medianoche', value: '#1E2A5A', price: 50 },
];

// Complementos, dibujados en el sistema del avatar (cabeza hacia (-3, -4)).
export const HATS = [
  { id: 'lazo', name: 'Lazo', price: 40, svg: '<path d="M-6 -6.4 l-3.4 -2.4 l0.2 4.4 z M-6 -6.4 l3.2 -2.6 l0.2 4.4 z" class="acc-pink"/><circle cx="-6" cy="-6.4" r="1.2" class="acc-pink-d"/>' },
  { id: 'flor', name: 'Flor', price: 40, svg: '<g transform="translate(-5.5 -7.2)">' + [0, 72, 144, 216, 288].map((a) => `<ellipse rx="1.3" ry="2" transform="rotate(${a}) translate(0 -1.8)" class="acc-petal"/>`).join('') + '<circle r="1.1" class="acc-sun"/></g>' },
  { id: 'gorro', name: 'Gorro de lana', price: 60, svg: '<path d="M-10.4 -4.6 q5 -7.4 10 0 z" class="acc-mint"/><rect x="-10.8" y="-5.4" width="10.8" height="1.8" rx="0.9" class="acc-mint-d"/><circle cx="-5.4" cy="-10.6" r="1.5" class="acc-white"/>' },
  { id: 'gorra', name: 'Gorra', price: 60, svg: '<path d="M-10 -4.6 q4.6 -6.4 9.4 0 z" class="acc-coral"/><path d="M-10.6 -4.6 h-4.4 q1.4 1.2 4.4 1.2 z" class="acc-coral-d"/>' },
  { id: 'estrella', name: 'Horquilla de estrella', price: 50, svg: '<path d="M-4 -10.2 l1 2.1 2.3 0.3 -1.7 1.6 0.4 2.3 -2 -1.1 -2 1.1 0.4 -2.3 -1.7 -1.6 2.3 -0.3 z" class="acc-sun"/>' },
  { id: 'gafas', name: 'Gafas de sol', price: 70, svg: '<rect x="-6.4" y="-3.4" width="4.4" height="2.6" rx="1.2" class="acc-dark"/><path d="M-2 -2.4 h1.6" class="acc-line"/><path d="M-6.4 -2.4 h-2" class="acc-line"/>' },
  { id: 'auriculares', name: 'Auriculares', price: 80, svg: '<path d="M-11 -2 q5.4 -10 11 0" class="acc-band"/><rect x="-12.4" y="-3.2" width="3" height="4" rx="1.4" class="acc-uva"/><rect x="-0.8" y="-3.2" width="3" height="4" rx="1.4" class="acc-uva"/>' },
  { id: 'boina', name: 'Boina', price: 80, svg: '<ellipse cx="-5" cy="-5.6" rx="5.6" ry="2" class="acc-wine"/><path d="M-5 -7.4 v-1.6" class="acc-line"/>' },
  { id: 'corona', name: 'Corona', price: 150, svg: '<path d="M-9.6 -4.6 l0.6 -5 2.4 2.4 2 -3.6 2 3.6 2.4 -2.4 0.6 5 z" class="acc-gold"/><circle cx="-4.6" cy="-6.6" r="0.8" class="acc-pink"/>' },
  { id: 'chistera', name: 'Chistera', price: 120, svg: '<rect x="-8.6" y="-12.6" width="7.2" height="7.6" rx="0.8" class="acc-dark"/><rect x="-11" y="-5.6" width="12" height="1.6" rx="0.8" class="acc-dark"/><rect x="-8.6" y="-7.6" width="7.2" height="1.4" class="acc-pink"/>' },
];

export const findSkin = (id) => SKINS.find((s) => s.id === id) ?? SKINS[0];
export const findColor = (id) => COLORS.find((c) => c.id === id || c.value.toLowerCase() === String(id).toLowerCase());
export const findHat = (id) => HATS.find((h) => h.id === id) ?? null;

// Todo lo comprable, para calcular lo gastado.
export function priceOf(id) {
  const [kind, key] = id.split(':');
  const list = { skin: SKINS, color: COLORS, hat: HATS }[kind] ?? [];
  return list.find((x) => x.id === key)?.price ?? 0;
}

// Pájaro de la jugadora: cabeza de nota, pico, ojo, ala, cola y complemento.
export function birdSvg({ color, hat = null, cls = 'avatar', mood = 'happy', title = '' } = {}) {
  const g = GLYPHS.noteheadBlack;
  const h = findHat(hat);
  const eye = mood === 'sing'
    ? '<path d="M-4.6 -2.4 q1.4 -1.4 2.8 0" class="eye-line"/>'
    : '<circle class="eye" cx="-3.2" cy="-2" r="1.6"/><circle class="eye-shine" cx="-3.7" cy="-2.5" r="0.5"/>';
  return `<svg class="${cls}" viewBox="-15 -14 30 24" style="--c:${color}" role="img" aria-label="${title || 'Tu pájaro'}">
    <path class="tail" d="M7 -2.7 l6.9 -4.5 l-1.8 6.1 z"/>
    <path class="head" d="${g.d}" transform="translate(-9 0) scale(0.06 -0.06)"/>
    <path class="wing" d="M-1.6 2.2 q3.4 2.4 6.6 -1.4"/>
    <path class="beak" d="M-7.8 -0.3 l-5.4 1.7 l5.1 2.4 z"/>
    ${mood === 'sing' ? '<path class="beak" d="M-7.8 0.8 l-4.4 2.8 l4.6 0.6 z"/>' : ''}
    ${eye}
    <circle class="cheek" cx="-4.4" cy="1.4" r="1.1"/>
    ${h ? `<g class="acc">${h.svg}</g>` : ''}
  </svg>`;
}
