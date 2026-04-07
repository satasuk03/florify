import type { MissionType } from '../types/game';

export interface MissionTemplate {
  id: string;
  type: MissionType;
  target: number;
}

export const MISSION_POOL: MissionTemplate[] = [
  { id: 'water_5',  type: 'water',  target: 5 },
  { id: 'water_10', type: 'water',  target: 10 },
  { id: 'water_15', type: 'water',  target: 15 },
  { id: 'plant_1',  type: 'plant',  target: 1 },
  { id: 'plant_2',  type: 'plant',  target: 2 },
  { id: 'plant_3',  type: 'plant',  target: 3 },
  { id: 'harvest_1', type: 'harvest', target: 1 },
  { id: 'harvest_2', type: 'harvest', target: 2 },
  { id: 'harvest_rare',       type: 'harvest_rare',       target: 1 },
  { id: 'visit_gallery',      type: 'visit_gallery',      target: 1 },
  { id: 'visit_floripedia',   type: 'visit_floripedia',   target: 1 },
  { id: 'share_florist_card', type: 'share_florist_card', target: 1 },
];

export const MISSION_POINTS_PER = 10;
export const MISSION_MILESTONES = [10, 20, 30, 40, 50] as const;
export const MISSION_MILESTONE_DROPS = [10, 20, 30, 40, 50] as const;
export const DAILY_MISSION_COUNT = 5;
