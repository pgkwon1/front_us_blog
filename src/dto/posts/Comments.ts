export interface ICommentResponse {
  count: number;
  commentList: IComment[];
}

export interface IComment {
  id: string;
  postId: string;
  userId: string;
  contents: string;
  edit?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICommentDto {
  id: string;
  postId: string;
  contents: string;
}

export type IEditCommentDto = Pick<ICommentDto, "id"> & {
  editContents: string;
  index: number;
};

export type IEditCommentRequestDto = Omit<ICommentDto, "contents"> & {
  editContents: string;
};
