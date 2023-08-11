export interface IRootState {
  globalReducer: IGlobalReducer;
  userReducer: IUserReducer;
  postReducer: IPostReducer;
  profileReducer: IProfileReducer;
  projectReducer: IProjectReducer;
}

interface IGlobalReducer {
  isError: boolean;
  errorMessage: string;
  isNotice: boolean;
  noticeMessage: string;
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

interface IProfileReducer {
  profileId: string;
  profilePicture: string;
  profileOwner: boolean;
  profileUserId: string;
}

interface IProjectReducer {
  projectThumb: string;
  projectPhoto1: string;
  projectPhoto2: string;
  projectPhoto3: string;
}
