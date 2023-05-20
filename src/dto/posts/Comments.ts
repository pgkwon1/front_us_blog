export interface ICommentResponse {
  count: number;
  commentList: IComment[];
}

export interface IComment {
  id: string;
  postId: string;
  userId: string;
  contents: string;
  createdAt: Date;
  updatedAt: Date;
}
