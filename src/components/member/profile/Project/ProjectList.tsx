import {
  DEFAULT_REACT_QUERY_CACHE_TIME,
  DEFAULT_REACT_QUERY_STALE_TIME,
} from "@/constants/react-query.constants";
import { IRootState } from "@/dto/ReduxDto";
import { IProjectInfoAttr } from "@/dto/profile/ProjectDto";
import frontApi from "@/modules/apiInstance";
import apiClient from "@/modules/reactQueryInstance";
import { useMutation, useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";

import { Chip, IconButton } from "@mui/joy";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import Image from "next/image";
import styled from "@/styles/member/Project.module.css";
import moment from "moment-timezone";
import { setErrorInfo, setNoticeInfo } from "@/store/reducers/global";
import { IErrorResponseDto } from "@/dto/ErrorDto";

export default function ProjectList() {
  const [projectList, setProjectList] = useState<IProjectInfoAttr[]>([]);
  const { profileUserId, profileOwner } = useSelector(
    (state: IRootState) => state.profileReducer
  );
  const dispatch = useDispatch();

  const getProject = async () => {
    const result = await frontApi.get(`/project/user/${profileUserId}`);
    return result.data;
  };

  const { data, isLoading } = useQuery(
    ["getProjectList", profileUserId],
    getProject,
    {
      enabled: false,
    }
  );

  const handleDelete = async (projectsId: string): Promise<void> => {
    await deleteMutation.mutate(projectsId);
  };
  const deleteProject = async (
    projectsId: string
  ): Promise<boolean | IErrorResponseDto> => {
    const result = await frontApi.delete(`/project/delete`, {
      data: {
        projectsId,
      },
    });
    return result.data;
  };

  const deleteMutation = useMutation(["deleteProject"], deleteProject, {
    onSuccess: (data) => {
      const isError = typeof data !== "boolean" && "error" in data;
      if (isError) {
        dispatch(
          setErrorInfo({
            isError: true,
            errorMessage: data.message,
          })
        );
      } else {
        dispatch(
          setNoticeInfo({
            isNotice: true,
            noticeMessage: "성공적으로 삭제되었습니다.",
          })
        );
      }
    },
  });

  useEffect(() => {
    apiClient.prefetchQuery(["getProjectList", profileUserId], getProject, {
      staleTime: DEFAULT_REACT_QUERY_STALE_TIME,
      cacheTime: DEFAULT_REACT_QUERY_CACHE_TIME,
    });
  }, []);

  useEffect(() => {
    setProjectList(data);
  }, [data, isLoading]);
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "right" }}>
        {profileOwner ? (
          <Link href="/member/project/write">
            <IconButton>
              <AddIcon />
            </IconButton>
          </Link>
        ) : (
          ""
        )}
      </Box>

      {projectList?.length > 0 ? (
        projectList?.map((project, index) => {
          return (
            <Link href={`/member/project/${project.id}`} key={index}>
              <Box className={styled.listWrap}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Chip>카테고리</Chip>
                  {profileOwner ? (
                    <Box sx={{ display: "flex", gap: "1rem" }}>
                      <Link href={`/member/project/${project.id}/edit`}>
                        <IconButton>
                          <EditIcon />
                        </IconButton>
                      </Link>
                      <IconButton
                        onClick={() => handleDelete(project.id as string)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ) : (
                    ""
                  )}
                </Box>
                <Box>
                  <Typography variant="h4">{project.projectName}</Typography>
                </Box>
                <Box>
                  <Typography variant="h6">
                    {project.projectOverView}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: "0.9rem", color: "#767676" }}>
                    {moment(project.startDate).format("YYYY-MM-DD").toString()}{" "}
                    ~{" "}
                    {project.inProgress
                      ? "현재 진행중"
                      : moment(project.endDate).format("YYYY-MM-DD").toString()}
                  </Typography>
                </Box>
                {project.projectThumb ? (
                  <Box className={styled.listContainer}>
                    <Box>
                      <Chip startDecorator={<InsertPhotoIcon />}>
                        프로젝트 썸네일
                      </Chip>
                    </Box>
                    <Image
                      width={"500"}
                      height={"300"}
                      src={`${process.env.NEXT_PUBLIC_FRONT_API_URL}/images/projects/${project.projectThumb}`}
                      alt="screenshot"
                    />
                  </Box>
                ) : (
                  ""
                )}
              </Box>
            </Link>
          );
        })
      ) : (
        <Box>진행하신 프로젝트를 등록해주세요.</Box>
      )}
    </Box>
  );
}
