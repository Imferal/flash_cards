// data/types.ts

export interface Folder {
  id: string;
  name: string;
  parentFolderId: string | null;
  createdByUser: number;
}

export interface Card {
  frontText: string;
  backText: string;
}

export interface Collection {
  id: string;
  name: string;
  folderId: string | null;
  createdByUser: number;
  selected: number;
  cards: Card[];
}