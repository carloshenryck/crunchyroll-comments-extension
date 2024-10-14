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
  likes: number;
  createdAt: string;
  parent: number | null;
  message: TrustedHTML;
  isDeleted: boolean;
  replies?: IComment[];
}
