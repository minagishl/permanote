export interface Note {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  type: 'text' | 'code';
  language?: string;
  color: string;
  zIndex: number;
  created: Date;
  updated: Date;
}

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}
