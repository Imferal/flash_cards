// data/types.ts

export interface Folder {
  id: string;
  name: string;
  parentFolderId: string | null;
  createdByUser: number;
}

export interface Card {
  id: string;
  frontText: string;
  backText: string;
}

export interface Collection {
  id: string;
  name: string;
  folderId: string | null;
  createdByUser: number;
  selected: boolean;
  cards: Card[];
}