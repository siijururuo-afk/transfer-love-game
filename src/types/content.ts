// Core content data model. Mirrors the DOCX source blocks 1:1.
// text always holds the ORIGINAL paragraph text; never rewritten.

export type ContentType =
  | 'narrative'
  | 'dialogue'
  | 'scene_card'
  | 'program_task'
  | 'program_rule'
  | 'program_notice'
  | 'letter'
  | 'sms'
  | 'interview'
  | 'observation_room'
  | 'text_chat'
  | 'talking_room'
  | 'x_room'
  | 'identity_reveal'
  | 'date_task'
  | 'finger_game'
  | 'truth_game'
  | 'interlude'
  | 'forum'
  | 'social_media'
  | 'media'
  | 'program_caption'
  | 'final_choice'
  | 'epilogue'
  | 'lyrics'
  | 'fallback';

export interface ChildSegment {
  parentSourceId: string;
  segmentId: string;
  order: number;
  speaker?: string;
  text: string;
}

export interface ContentBlock {
  sourceId: string;
  chapter: string;
  chapterIndex: number;
  globalOrder: number;
  order: number;
  type: ContentType;
  subtype?: string;
  style: string;
  speaker?: string;
  text: string;
  childSegments?: ChildSegment[];
  metadata?: Record<string, unknown>;
}

export interface PresentationItem {
  sourceId: string;
  type: ContentType;
  subtype?: string;
  speaker?: string;
  text: string;
}

export type SceneKind =
  | 'single'
  | 'forum'
  | 'chat'
  | 'voice'
  | 'dialogue'
  | 'interview'
  | 'observation'
  | 'game'
  | 'sms'
  | 'final'
  | 'epilogue'
  | 'social';

export interface ChapterMeta {
  id: number;
  name: string;
  file: string;
  blockCount: number;
  firstSourceId: string;
  lastSourceId: string;
}

export interface Manifest {
  title: string;
  totalChapters: number;
  totalBlocks: number;
  childSegments: number;
  chapters: ChapterMeta[];
  typeCounts: Record<string, number>;
  subtypeCounts: Record<string, number>;
}

// A flat "display step" consumed by the reader.
export interface ReadStep {
  sourceId: string;
  sourceIds: string[];
  block: ContentBlock;
  childIndex: number | null; // null = whole block; otherwise index into childSegments
  text: string; // text to display for this step
  speaker?: string;
  items: PresentationItem[];
  sceneKey?: string;
  sceneKind?: SceneKind;
}
