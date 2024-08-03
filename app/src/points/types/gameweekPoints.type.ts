import { Points } from './points.type';

export type GameweekPoints = {
  gameweek: number;
  points: number;
  pointTypes?: Points[];
};
