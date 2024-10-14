export interface ICommentsData {
  cursor: {
    hasNext: boolean;
    next: string;
  };
  response: IComment[];
}

export interface IComment {
  id: string;
  author: {
    username: string;
    name: string;
  };
  createdAt: string;
  parent: number | null;
  message: string;
  isDeleted: boolean;
  media: {
    resolvedUrl: string;
  }[];
  replies?: IComment[];
}
