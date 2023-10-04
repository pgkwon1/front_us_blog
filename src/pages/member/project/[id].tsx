import { Chip, Stack } from "@mui/joy";
import { Box, InputLabel, Paper, Typography } from "@mui/material";
import DateRangeIcon from "@mui/icons-material/DateRange";
import WorkIcon from "@mui/icons-material/Work";
import PersonIcon from "@mui/icons-material/Person";
import ScreenshotMonitorIcon from "@mui/icons-material/ScreenshotMonitor";
import CodeIcon from "@mui/icons-material/Code";
import DescriptionIcon from "@mui/icons-material/Description";
import styled from "@/styles/member/Project.module.css";

import Carousel from "react-material-ui-carousel";
import { useEffect, useState } from "react";
import Image from "next/image";
import apiClient from "@/modules/reactQueryInstance";
import { useRouter } from "next/router";
import {
  DEFAULT_REACT_QUERY_CACHE_TIME,
  DEFAULT_REACT_QUERY_STALE_TIME,
} from "@/constants/react-query.constants";
import frontApi from "@/modules/apiInstance";
import { useQuery, QueryClient, dehydrate } from "react-query";
import { IProjectInfoAttr } from "@/dto/profile/ProjectDto";
import Link from "next/link";
import moment from "moment-timezone";
import axios from "axios";

export default function ProjectView() {
  const [projectInfo, setProjectInfo] = useState<IProjectInfoAttr>({
    userId: "",
    projectName: "",
    projectOverView: "",
    projectPhoto1: "",
    projectPhoto2: "",
    projectPhoto3: "",
    role: "",
    personnel: 0,
    startDate: new Date(),
    endDate: new Date(),
    inProgress: false,
    Skills: [],
  });
  const router = useRouter();
  const id = router.query.id as string;

  const getProject = async () => {
    const result = await frontApi.get(`/project/${id}`);
    return result.data;
  };

  const { data } = useQuery(["getProject", id], getProject, {
    enabled: false,
  });
  useEffect(() => {
    apiClient.prefetchQuery(["getProject", id], getProject, {
      staleTime: DEFAULT_REACT_QUERY_STALE_TIME,
      cacheTime: DEFAULT_REACT_QUERY_CACHE_TIME,
    });
  }, []);

  useEffect(() => {
    if (data !== undefined) {
      setProjectInfo(data);
    }
  }, [data]);
  return (
    <Box className={styled.viewWrap}>
      <Link href={`/member/profile/${projectInfo.userId}`}></Link>
      <Box>
        <Chip>프로젝트</Chip>
      </Box>
      <Box className={styled.viewContainer}>
        <Typography variant="h4">{projectInfo.projectName}</Typography>
      </Box>

      <Box className={styled.viewContainer}>
        <InputLabel>
          <Chip startDecorator={<DescriptionIcon />}>프로젝트 설명</Chip>
        </InputLabel>
        <Typography>{projectInfo.projectOverView}</Typography>
      </Box>

      <Box className={styled.viewContainer}>
        <InputLabel>
          <Chip startDecorator={<PersonIcon />}>인원(본인포함)</Chip>
        </InputLabel>
        <Typography>{projectInfo.personnel}명</Typography>
      </Box>
      <Box className={styled.viewContainer}>
        <InputLabel>
          <Chip startDecorator={<WorkIcon />}>역할</Chip>
        </InputLabel>
        <Typography>{projectInfo.role}</Typography>
      </Box>
      <Box className={styled.viewContainer}>
        <InputLabel>
          <Chip startDecorator={<CodeIcon />}>기술 스택</Chip>
        </InputLabel>
        <Stack
          flexWrap="wrap"
          sx={{ gap: 1, overflow: "auto" }}
          direction={{ xs: "column", sm: "row" }}
        >
          {projectInfo.Skills.map((skill, index) => {
            return (
              <Chip key={index} size={"lg"} variant="outlined">
                {skill.name}
              </Chip>
            );
          })}
        </Stack>
      </Box>
      <Box className={styled.viewContainer}>
        <InputLabel>
          <Chip startDecorator={<DateRangeIcon />}>작업 기간</Chip>
        </InputLabel>
        <Box>
          {moment(projectInfo.startDate).format("YYYY-MM-DD").toString()} ~{" "}
          {projectInfo.inProgress
            ? "현재 진행중"
            : moment(projectInfo.endDate).format("YYYY-MM-DD").toString()}
        </Box>
      </Box>

      <Box className={styled.viewContainer}>
        <InputLabel>
          <Chip startDecorator={<ScreenshotMonitorIcon />}>
            프로젝트 스크린샷
          </Chip>
        </InputLabel>
        <Box>
          <Carousel navButtonsAlwaysInvisible={true} autoPlay={false}>
            {[
              projectInfo.projectPhoto1,
              projectInfo.projectPhoto2,
              projectInfo.projectPhoto3,
            ].map((photo, index) => {
              if (photo) {
                return (
                  <Paper key={index} className={styled.viewPhotoWrap}>
                    <Image
                      width={"1000"}
                      height={"600"}
                      src={`${process.env.NEXT_PUBLIC_FRONT_API_URL}/images/projects/${photo}`}
                      alt="screenshot"
                    />
                  </Paper>
                );
              } else {
                console.log(index);
                return false;
              }
            })}
          </Carousel>
        </Box>
      </Box>
    </Box>
  );
}
export const getServerSideProps = (context) => {
  const { id } = context.query;
  const client = new QueryClient();
  client.prefetchQuery(["getProject", id], async () => {
    const result = await axios.get(`/project/${id}`);
    return result.data;
  });
  return {
    props: {
      dehydratedState: dehydrate(client),
      isSideBarRender: false,
    },
  };
};
