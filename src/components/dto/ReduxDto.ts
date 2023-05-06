export interface IRootState {
  userReducer: IUserReducer;
  postReducer: IPostReducer;
}

interface IUserReducer {
  login_state: number;
  userId: string;
}

interface IPostReducer {
  currentTag: string;
  currentCategory: string;
}
