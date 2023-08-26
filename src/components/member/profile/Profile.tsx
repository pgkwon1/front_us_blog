import { useEffect, useState } from "react";
import { dehydrate, useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { Avatar, IconButton, Tab, TabList, TabPanel, Tabs } from "@mui/joy";
import { Box, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

import Skills from "@/components/member/profile/Skills";
import UserPostList from "@/components/member/profile/UserPostList";
import { IRootState } from "@/dto/ReduxDto";
import frontApi from "@/modules/apiInstance";
import apiClient from "@/modules/reactQueryInstance";
import { setProfileId, setProfilePicture } from "@/store/reducers/profile";
import ProfileEdit from "@/components/member/profile/ProfileEdit";
import ProjectList from "@/components/member/profile/Project/ProjectList";
import {
  DEFAULT_REACT_QUERY_CACHE_TIME,
  DEFAULT_REACT_QUERY_STALE_TIME,
} from "@/constants/react-query.constants";
import { useRouter } from "next/router";
import { GitHub, YouTube, Create, Instagram } from "@mui/icons-material";
import Link from "next/link";

interface ProfileProps {
  profileOwner: boolean;
}
export default function Profile({ profileOwner }: ProfileProps) {
  const { profilePicture } = useSelector(
    (state: IRootState) => state.profileReducer
  );
  const userId = useSelector((state: IRootState) => state.userReducer.userId);
  const router = useRouter();
  const queryUserId = router.query.userId as string;

  const profileUserId = profileOwner ? userId : queryUserId;

  const dispatch = useDispatch();
  const [profileData, setProfileData] = useState({
    profileId: "",
    userId: "",
    aboutMe: "",
    jobGroup: "",
    picture: "",
    instagramLink: "",
    githubLink: "",
    youtubeLink: "",
    blogLink: "",
    skills: [],
  });
  const [open, setOpen] = useState(false);

  const getProfile = async () => {
    const profile = await frontApi.get(`/member/${profileUserId}`);
    return profile.data.profile;
  };

  const { data, isLoading } = useQuery(
    ["getProfile", profileUserId],
    getProfile,
    {
      enabled: false,
    }
  );

  useEffect(() => {
    apiClient.prefetchQuery(["getProfile", profileUserId], getProfile, {
      staleTime: DEFAULT_REACT_QUERY_STALE_TIME,
      cacheTime: DEFAULT_REACT_QUERY_CACHE_TIME,
    });

    setProfileData((current) => {
      return {
        ...current,
        profileId: data?.id,
        userId: data?.userId,
        aboutMe: data?.aboutMe,
        jobGroup: data?.jobGroup,
        instagramLink: data?.instagramLink,
        githubLink: data?.githubLink,
        youtubeLink: data?.youtubeLink,
        blogLink: data?.blogLink,
        skills: data?.Skills.map((skill: any) => {
          return {
            id: skill.ProfileSkills.id,
            name: skill.name,
            category: skill.category,
          };
        }),
      };
    });
    dispatch(setProfileId(data?.id));
    dispatch(setProfilePicture(data?.picture));
  }, [data, isLoading]);

  return (
    <Box>
      <Box>
        <Typography>마이페이지</Typography>
        <Box
          sx={{ p: 2, display: "flex", flexDirection: "column", gap: "1.2rem" }}
        >
          <Box sx={{ display: "flex", gap: "1rem" }}>
            <Avatar
              size="lg"
              color="primary"
              src={`${process.env.NEXT_PUBLIC_FRONT_API_URL}/images/profile/${profilePicture}`}
            >
              {profileUserId?.slice(0, 2).toUpperCase()}
            </Avatar>
            <Typography variant="h4">
              {profileUserId}
              {profileOwner ? (
                <IconButton onClick={() => setOpen(true)}>
                  <EditIcon />
                </IconButton>
              ) : (
                ""
              )}
              {open ? (
                <ProfileEdit
                  jobGroup={profileData?.jobGroup}
                  aboutMe={profileData?.aboutMe}
                  instagramLink={profileData?.instagramLink}
                  githubLink={profileData?.githubLink}
                  youtubeLink={profileData?.youtubeLink}
                  blogLink={profileData?.blogLink}
                  setOpen={setOpen}
                />
              ) : (
                ""
              )}
            </Typography>
          </Box>

          <Box color={"#918f8f"}>
            {profileData.jobGroup === ""
              ? "직무/직책을 입력해주세요"
              : profileData.jobGroup}
          </Box>

          <Box color={"#918f8f"}>
            {profileData.aboutMe === ""
              ? "자기소개를 입력해주세요"
              : profileData.aboutMe}
          </Box>

          <Box sx={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
            {profileData?.instagramLink ? (
              <Link
                target="parent"
                href={
                  profileData?.instagramLink
                    ? `https://instagram.com/${profileData?.instagramLink}/`
                    : "#"
                }
              >
                <Instagram fontSize="large" />
              </Link>
            ) : (
              ""
            )}
            {profileData?.githubLink ? (
              <Link
                target="parent"
                href={
                  profileData?.githubLink
                    ? `https://github.com/${profileData?.githubLink}`
                    : "#"
                }
              >
                <GitHub fontSize="large" />
              </Link>
            ) : (
              ""
            )}
            {profileData?.youtubeLink ? (
              <Link
                target="parent"
                href={
                  profileData?.youtubeLink
                    ? `https://youtube.com/@${profileData?.youtubeLink}`
                    : "#"
                }
              >
                <YouTube fontSize="large" />
              </Link>
            ) : (
              ""
            )}
            {profileData?.blogLink ? (
              <Link
                target="parent"
                href={profileData?.blogLink ? profileData?.blogLink : "#"}
              >
                <Create fontSize="large" />
              </Link>
            ) : (
              ""
            )}
          </Box>
        </Box>
        <Tabs
          aria-label="Icon tabs"
          defaultValue={0}
          sx={{ mb: 2, borderRadius: "lg" }}
        >
          <TabList>
            <Tab>기술</Tab>
            <Tab>게시글</Tab>
            <Tab>프로젝트</Tab>
          </TabList>
          <TabPanel>
            <Skills skills={profileData?.skills} />
          </TabPanel>
          <TabPanel value={1}>
            <UserPostList />
          </TabPanel>

          <TabPanel value={2}>
            <ProjectList />
          </TabPanel>
        </Tabs>
      </Box>
    </Box>
  );
}

export const getServerSideProps = async () => {
  apiClient.prefetchQuery("getAllSkillsList", async () => {
    await axios.get("/skills");
  });
  return {
    props: {
      isSideBarRender: false,
      dehydrateState: dehydrate(apiClient),
    },
  };
};
