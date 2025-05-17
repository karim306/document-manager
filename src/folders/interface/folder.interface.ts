export interface Folder {
    id: string;
    name: string;
    parentId?: string;
    children?: Folder[];
  }