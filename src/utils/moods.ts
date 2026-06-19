import { Coffee, Moon, Sun, CloudRain, Brain, Sparkles, Wind, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface MoodDef {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
}

export const MOODS: MoodDef[] = [
  { id: 'cozy', label: 'Cozy', icon: Coffee, color: '#D4A373' },
  { id: 'sleepy', label: 'Sleepy', icon: Moon, color: '#A288E3' },
  { id: 'happy', label: 'Happy', icon: Sun, color: '#F4A261' },
  { id: 'sad', label: 'Sad', icon: CloudRain, color: '#90E0EF' },
  { id: 'focus', label: 'Focus', icon: Brain, color: '#81B29A' },
  { id: 'night', label: 'Night', icon: Sparkles, color: '#3A86FF' },
  { id: 'soft', label: 'Soft', icon: Wind, color: '#F28482' },
  { id: 'energy', label: 'Energy', icon: Zap, color: '#E07A5F' },
];
