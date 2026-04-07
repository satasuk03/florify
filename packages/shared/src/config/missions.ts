import type { MissionType } from '../types/game';

export interface MissionTemplate {
  id: string;
  type: MissionType;
  target: number;
}

export const MISSION_POOL: MissionTemplate[] = [
  { id: 'water_100', type: 'water',  target: 100 },
  { id: 'water_150', type: 'water',  target: 150 },
  { id: 'water_200', type: 'water',  target: 200 },
  { id: 'plant_10',  type: 'plant',  target: 10 },
  { id: 'plant_15',  type: 'plant',  target: 15 },
  { id: 'harvest_10', type: 'harvest', target: 10 },
  { id: 'harvest_15', type: 'harvest', target: 15 },
  { id: 'harvest_rare_2',     type: 'harvest_rare',       target: 2 },
  { id: 'harvest_rare_3',     type: 'harvest_rare',       target: 3 },
  { id: 'harvest_rare_5',     type: 'harvest_rare',       target: 5 },
  { id: 'visit_gallery',      type: 'visit_gallery',      target: 1 },
  { id: 'visit_floripedia',   type: 'visit_floripedia',   target: 1 },
  { id: 'share_florist_card', type: 'share_florist_card', target: 1 },
];

export const MISSION_POINTS_PER = 10;
export const MISSION_MILESTONES = [10, 20, 30, 40, 50] as const;
export const MISSION_MILESTONE_DROPS = [10, 20, 30, 40, 50] as const;
export const DAILY_MISSION_COUNT = 5;
