const category = ["기술", "직장", "잡담"] as const;
const likeType = ["LIKE", "UNLIKE"] as const;
export type Category = (typeof category)[keyof typeof category];
export type LikeType = (typeof likeType)[keyof typeof likeType];
export type IPostByIdPage = IPostList;
export type IPostByTagPage = IPostByIndexPage;

export interface IPostDto {
  id: string;
  title: string;
  num: number;
  contents: string;
  category: Category;
  Tags: IPostByTags[];
  createdAt: Date;
  like: number;
  unlike: number;
}

export interface IPostByIndexPage {
  count: number;
  postList: IPostList[];
}

export interface IPostList {
  id: string;
  author: string;
  Tags: IPostByTags[];
  postsLikes: IPostByLikes[];
  category: Category;
  title: string;
  contents: string;
  like: number;
  unlike: number;
  createdAt: Date;
}
export interface IPostByTags {
  PostsTags: { postId: string; tagId: string };
  id: string;
  tagName: string;
}
/**
 * 글쓰기 페이지 내 태그 추가 dto
 */
export interface IAddTagDto {
  tagName: string;
}

export interface IPostByLikes {
  id: string;
  postId: string;
  type: LikeType;
  userId: string;
  createdAt: Date;
  updateAt: Date;
}

export interface IPostWriteForm {
  title: string;
  tags: IAddTagDto[];
  contents: string;
  category: Category;
}
