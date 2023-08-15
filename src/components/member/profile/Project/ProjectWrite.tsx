import {
  Autocomplete,
  Button,
  Checkbox,
  Chip,
  ChipDelete,
  Stack,
} from "@mui/joy";
import { Box, Typography, TextField, InputLabel, Input } from "@mui/material";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ko from "date-fns/locale/ko";

import DateRangeIcon from "@mui/icons-material/DateRange";
import WorkIcon from "@mui/icons-material/Work";
import PersonIcon from "@mui/icons-material/Person";
import CodeIcon from "@mui/icons-material/Code";
import SendIcon from "@mui/icons-material/Send";
import styled from "@/styles/member/Project.module.css";

import {
  ChangeEvent,
  SyntheticEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useMutation, useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import moment from "moment-timezone";
import frontApi from "@/modules/apiInstance";
import apiClient from "@/modules/reactQueryInstance";
import { ISkillsAttr } from "@/dto/profile/SkillsDto";
import { IProjectInfoAttr } from "@/dto/profile/ProjectDto";
import ProjectPhoto from "@/components/member/profile/Project/ProjectPhoto";
import { IRootState } from "@/dto/ReduxDto";

import {
  DEFAULT_REACT_QUERY_CACHE_TIME,
  DEFAULT_REACT_QUERY_STALE_TIME,
} from "@/constants/react-query.constants";
import project, {
  setProjectPhoto1,
  setProjectPhoto2,
  setProjectPhoto3,
  setProjectThumb,
} from "@/store/reducers/project";
import { setErrorInfo, setNoticeInfo } from "@/store/reducers/global";

export default function ProjectWriteComponent({
  edit,
  projectId,
}: {
  edit?: boolean;
  projectId?: string;
}) {
  registerLocale("ko", ko);
  const [projectInfo, setProjectInfo] = useState<IProjectInfoAttr>({
    userId: "",
    projectName: "",
    projectOverView: "",
    role: "",
    personnel: 0,
    startDate: new Date(),
    endDate: new Date(),
    inProgress: false,
    Skills: [],
    apiSkillData: [],
  });

  const router = useRouter();

  const id = edit && router.query.id;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<IProjectInfoAttr>();
  const userId = useSelector((state: IRootState) => state.userReducer.userId);
  const { projectThumb, projectPhoto1, projectPhoto2, projectPhoto3 } =
    useSelector((state: IRootState) => state.projectReducer);
  const dispatch = useDispatch();

  const getAllSkillList = async () => {
    const result = await frontApi.get("skills");
    return result.data;
  };

  const { data } = useQuery("getAllSkillList", getAllSkillList, {
    enabled: false,
  });
  const handleProjectInfo = async (
    e: ChangeEvent<HTMLInputElement> | Date,
    attr: string
  ) => {
    setProjectInfo((current) => {
      return {
        ...current,
        [attr]: e instanceof Date ? e : e.target.value,
      };
    });
  };

  const handleSkillList = (
    event: SyntheticEvent<Element, Event>,
    newValue: any
  ): void => {
    if (newValue) {
      const { id, label, category } = newValue;
      setProjectInfo((current) => {
        const { Skills } = current;
        if (label !== undefined) {
          Skills.push({
            id,
            name: label as string,
            category,
          });
        }

        return {
          ...current,
          Skills,
        };
      });
    }
  };
  const handleCreate = async () => {
    const handleData = Object.assign(projectInfo, {
      userId,
      projectThumb,
      projectPhoto1,
      projectPhoto2,
      projectPhoto3,
    });
    await createMutation.mutate(handleData);
  };
  const createProject = async (projectInfo: IProjectInfoAttr) => {
    const result = await frontApi.post("/project/create", projectInfo);
    return result.data;
  };
  const createMutation = useMutation("projectCreate", createProject, {
    onSuccess: (data) => {
      if (data) {
        router.push(`/member/project/${data}`);
      }
    },
  });

  const handleDelete = async (index: number, skillsId?: string) => {
    const { Skills } = projectInfo;
    Skills.splice(index, 1);
    setProjectInfo((current) => {
      return {
        ...current,
        Skills,
      };
    });

    if (edit && skillsId) {
      projectInfo.apiSkillData?.includes(skillsId)
        ? await skillDeleteMutation.mutate(skillsId)
        : "";
    }
  };

  const deleteSkills = async (id: string) => {
    const result = await frontApi.delete("/project/skill/delete", {
      data: {
        id,
      },
    });
    return result.data;
  };
  const skillDeleteMutation = useMutation("deleteSkills", deleteSkills, {
    onSuccess(data) {
      if (!data) {
        dispatch(
          setErrorInfo({
            isError: true,
            errorMessage: "삭제에 실패하였습니다.",
          })
        );
      }
    },
  });
  /**
   *
   * 프로젝트 수정 영역
   */
  const getProject = async () => {
    const result = await frontApi.get(`/project/${projectId}`);
    return result.data;
  };

  const { data: editData, isLoading: editLoading } = useQuery(
    ["getProject", id],
    getProject,
    {
      onSuccess: () => {},
      enabled: id ? true : false,
      staleTime: DEFAULT_REACT_QUERY_STALE_TIME,
      cacheTime: DEFAULT_REACT_QUERY_CACHE_TIME,
    }
  );

  const handleEdit = async () => {
    await editMutation.mutate();
  };

  const editProject = async (): Promise<string> => {
    const handleData = Object.assign(projectInfo, {
      projectThumb,
      projectPhoto1,
      projectPhoto2,
      projectPhoto3,
    });
    const result = await frontApi.put(`/project/edit/${id}`, {
      projectInfo: handleData,
    });
    return result.data;
  };

  const editMutation = useMutation(["editProject", id], editProject, {
    onSuccess(data) {
      if (data) {
        apiClient.invalidateQueries(["getProject", id]);
        router.push(`/member/project/${id}`);
      }
    },
  });
  useEffect(() => {
    apiClient.prefetchQuery("getAllSkillList", getAllSkillList, {
      staleTime: Infinity,
      cacheTime: Infinity,
    });
    if (edit) {
      apiClient.prefetchQuery(["getProject", id], getProject, {
        staleTime: DEFAULT_REACT_QUERY_STALE_TIME,
        cacheTime: DEFAULT_REACT_QUERY_CACHE_TIME,
      });
    }
  }, []);

  useEffect(() => {
    const isNotOwner = editData && editData?.userId !== userId;
    if (isNotOwner) {
      router.back();
    }
    if (!editLoading && editData) {
      const { projectThumb, projectPhoto1, projectPhoto2, projectPhoto3 } =
        editData;

      const apiSkillData: string[] = [];
      Object.entries(editData).map(([key, value]: [string, any]) => {
        setValue(key, value);
        if (key === "Skills") {
          value.map((skill: any) =>
            apiSkillData.push(skill.ProjectsSkills?.id)
          );
        }
      });
      editData.apiSkillData = apiSkillData;
      dispatch(setProjectThumb(projectThumb));
      dispatch(setProjectPhoto1(projectPhoto1));
      dispatch(setProjectPhoto2(projectPhoto2));
      dispatch(setProjectPhoto3(projectPhoto3));
      setProjectInfo(editData);
    }
  }, [editData, editLoading]);
  /**
   *
   * 프로젝트 수정 영역 끝.
   */

  const getColorByCategory = useMemo(() => {
    return (category: string) => {
      switch (category) {
        case "programming language":
        case "scripting":
        case "framework":
        case "library":
        case "database":
        case "vcs":
        case "testing":
        case "cms":
        case "paradigm":
        case "architecture":
          return "primary";

        case "technology":
        case "cloud computing":
        case "machine learning":
        case "big data":
        case "file sharing":
        case "containerization":
        case "messaging system":
        case "api":
        case "operating system":
        case "scripting":
        case "search engine":
        case "technology":
        case "continuous integration":
        case "authentication":
        case "security":
          return "warning";

        case "communication":
        case "project management":
        case "productivity":
        case "collaboration":
        case "methodology":
        case "testing":
        case "design":
        case "marketing":
        case "analytics":
        case "search engine":
        case "advertising":
          return "success";
        default:
          return "neutral";
      }
    };
  }, []);

  return (
    <form onSubmit={handleSubmit(edit ? handleEdit : handleCreate)}>
      <Box className={styled.writeWrap}>
        <Box>
          <Chip color="primary">카테고리</Chip>
        </Box>
        <Box className={styled.writeContainer}>
          <InputLabel htmlFor="projectName">
            <Typography variant="h6">프로젝트 제목</Typography>
          </InputLabel>
          <TextField
            placeholder="프로젝트 제목을 입력해주세요."
            fullWidth
            {...register("projectName", {
              required: true,
            })}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleProjectInfo(e, "projectName")
            }
            {...(errors.projectName && {
              error: true,
              helperText: "프로젝트 제목을 입력하세요.",
            })}
            value={projectInfo?.projectName}
          ></TextField>
        </Box>

        <Box className={styled.writeContainer}>
          <InputLabel htmlFor="projectOverView">
            <Typography variant="h6">프로젝트 설명</Typography>
          </InputLabel>

          <TextField
            inputProps={{ name: "projectOverView" }}
            placeholder="프로젝트 설명을 입력해주세요."
            fullWidth
            maxRows={6}
            {...register("projectOverView", {
              required: true,
            })}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleProjectInfo(e, "projectOverView")
            }
            {...(errors.projectOverView && {
              error: true,
              helperText: "프로젝트 설명을 입력해주세요.",
            })}
            value={projectInfo?.projectOverView}
          ></TextField>
        </Box>

        <Box className={styled.writeContainer}>
          <InputLabel htmlFor="personnel">
            <Chip startDecorator={<PersonIcon />}>인원(본인포함)</Chip>
          </InputLabel>

          <TextField
            type="number"
            {...register("personnel", {
              required: true,
            })}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleProjectInfo(e, "personnel")
            }
            {...(errors.personnel && {
              error: true,
              helperText: "프로젝트 인원수를 입력해주세요.",
            })}
            value={projectInfo?.personnel}
          ></TextField>
        </Box>
        <Box className={styled.writeContainer}>
          <InputLabel htmlFor="role">
            <Chip startDecorator={<WorkIcon />}>역할</Chip>
          </InputLabel>
          <TextField
            fullWidth
            placeholder="프로젝트에서의 역할을 입력해주세요."
            inputProps={{ id: "role" }}
            {...register("role", {
              required: true,
            })}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleProjectInfo(e, "role")
            }
            {...(errors.role && {
              error: true,
              helperText: "프로젝트에서의 역할을 입력해주세요.",
            })}
            value={projectInfo?.role}
          ></TextField>
        </Box>
        <Box className={styled.writeContainer}>
          <InputLabel htmlFor="skill">
            <Chip startDecorator={<CodeIcon />}>기술 스택</Chip>
          </InputLabel>
          <Stack
            className={styled.writeSkillStack}
            flexWrap="wrap"
            direction={{ xs: "row", sm: "row" }}
          >
            {projectInfo?.Skills.map((skill, index) => {
              return (
                <Chip
                  variant="outlined"
                  color={getColorByCategory(skill.category)}
                  key={index}
                  endDecorator={
                    <ChipDelete
                      onClick={() =>
                        handleDelete(
                          index,
                          edit ? skill.ProjectsSkills?.id : undefined
                        )
                      }
                    />
                  }
                >
                  {skill.name}
                </Chip>
              );
            })}
          </Stack>
          <Autocomplete
            className={styled.writeSkillInput}
            id="skill"
            freeSolo
            placeholder="기술을 선택해주세요."
            options={data.map((skillInfo: ISkillsAttr) => {
              const { id, name, category } = skillInfo;
              return {
                id,
                label: name,
                category,
              };
            })}
            onChange={handleSkillList}
          ></Autocomplete>
        </Box>
        <Box className={styled.writeContainer}>
          <InputLabel htmlFor="date">
            <Chip startDecorator={<DateRangeIcon />}>작업 기간</Chip>
          </InputLabel>
          <Box>
            <Typography>시작일자</Typography>
            <DatePicker
              onChange={(e: Date) => handleProjectInfo(e, "startDate")}
              dateFormat="yyyy-MM-dd"
              dateFormatCalendar="yyyy년 MM월"
              locale="ko"
              selected={moment(projectInfo.startDate).toDate()}
            />
            ~
            <DatePicker
              id={"date"}
              onChange={(e: Date) => handleProjectInfo(e, "endDate")}
              dateFormat="yyyy-MM-dd"
              dateFormatCalendar="yyyy년 MM월"
              locale="ko"
              {...(projectInfo?.inProgress ? { disabled: true } : "")}
              selected={moment(projectInfo.endDate).toDate()}
            />
            <Checkbox
              color="primary"
              label="현재 진행중"
              onClick={() =>
                setProjectInfo((current) => ({
                  ...current,
                  inProgress: !current.inProgress,
                }))
              }
            />
          </Box>
        </Box>
        <Box>
          <ProjectPhoto />
        </Box>

        <Button type="submit" variant="outlined" startDecorator={<SendIcon />}>
          등록
        </Button>
      </Box>
    </form>
  );
}

export const getServerSideProps = () => {
  return {
    props: {
      isSideBarRender: false,
    },
  };
};
