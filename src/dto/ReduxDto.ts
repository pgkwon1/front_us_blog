export interface IRootState {
  userReducer: IUserReducer;
  postReducer: IPostReducer;
}

interface IUserReducer {
  login_state: number;
  userId: string;
}

interface IPostReducer {
  currentPostId: string;
  currentTag: string;
  currentCategory: string;
}
