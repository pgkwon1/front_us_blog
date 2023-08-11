export interface IProfileSkills {
  id: string;
  profileId: string;
  skillsId: string;
}
export interface ISkillsAttr {
  id: string;
  name: string;
  label?: string;
  category: string;
  ProfileSkills?: IProfileSkills;
}

export interface ISkillsProp {
  skills: ISkillsAttr[];
}
