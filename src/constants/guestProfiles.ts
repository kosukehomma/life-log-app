import type { Profile } from '../types';

export const GUEST_PROFILES: Record<string, Partial<Profile>> = {
  'guest_company01@view.com': {
    nickname: 'ゲスト01',
    height: 172,
    start_weight: 89,
    target_weight: 75,
  },
  'guest_company02@view.com': {
    nickname: 'ゲスト02',
    height: 168,
    start_weight: 82,
    target_weight: 70,
  },
  'guest_company03@view.com': {
    nickname: 'ゲスト03',
    height: 178,
    start_weight: 94,
    target_weight: 80,
  },
};
