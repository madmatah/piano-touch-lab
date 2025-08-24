import type { Note } from '@/lib/music/theory/spn';

export interface KeyboardLayoutRequirements {
  startNote: Note;
  length: number;
}
