export interface IProjectInfoAttr {
  userId: string;
  projectName: string;
  projectOverView: string;
  projectThumb?: string;
  projectPhoto1?: string;
  projectPhoto2?: string;
  projectPhoto3?: string;
  role: string;
  personnel: number;
  startDate: Date;
  endDate: Date;
  inProgress: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  Skills: ISkillsAttr[];
  apiSkillData?: string[];
  [key: string]:
    | string
    | string[]
    | Date
    | number
    | ISkillsAttr[]
    | boolean
    | undefined;
}

interface ISkillsAttr {
  id: string;
  name: string;
  label?: string;
  category: string;
  ProjectsSkills?: IProjectsSkills;
}

interface IProjectsSkills {
  id: string;
  projectsId: string;
  skillsId: string;
}
