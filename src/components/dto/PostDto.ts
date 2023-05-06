const category = ["기술", "직장", "잡담"] as const;
type Category = (typeof category)[keyof typeof category];
export interface IPostDto {
  title: string;
  num: number;
  contents: string;
  category: Category;
  Tags: string[];
  createdAt: Date;
  like: number;
}
