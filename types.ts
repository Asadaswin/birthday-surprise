export interface WishState {
  text: string;
  loading: boolean;
  error: string | null;
}

export enum AppStage {
  INTRO = 'INTRO',
  CELEBRATION = 'CELEBRATION'
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  decay: number;
}
