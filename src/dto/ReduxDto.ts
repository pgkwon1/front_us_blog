export interface IRootState {
  globalReducer: IGlobalReducer;
  userReducer: IUserReducer;
  postReducer: IPostReducer;
}

interface IGlobalReducer {
  isError: boolean;
  errorMessage: string;
}
interface IUserReducer {
  login_state: number;
  userId: string;
}

interface IPostReducer {
  currentPostId: string;
  currentTag: string;
  currentCategory: string;
  editMode: boolean;
  editPostContents: string;
}
