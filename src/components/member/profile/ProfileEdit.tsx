import frontApi, { formDataApi } from "@/modules/apiInstance";
import {
  Avatar,
  Badge,
  Button,
  Chip,
  ModalClose,
  ModalDialog,
  Tooltip,
} from "@mui/joy";
import { Modal, TextField, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

import { useMutation } from "react-query";
import { useDispatch, useSelector } from "react-redux";

import { IRootState } from "@/dto/ReduxDto";
import { setProfilePicture } from "@/store/reducers/profile";
import { GitHub, YouTube, Create, Instagram, Info } from "@mui/icons-material";
import { setNoticeInfo } from "@/store/reducers/global";

interface ISkillsEditProp {
  jobGroup: string;
  aboutMe: string;
  instagramLink: string;
  githubLink: string;
  blogLink: string;
  youtubeLink: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
interface IInfoAttr {
  jobGroup: string;
  aboutMe: string;
  instagramLink: string;
  githubLink: string;
  blogLink: string;
  youtubeLink: string;
}
export default function ProfileEdit({
  jobGroup,
  aboutMe,
  instagramLink,
  githubLink,
  blogLink,
  youtubeLink,
  setOpen,
}: ISkillsEditProp) {
  const dispatch = useDispatch();
  const [info, setInfo] = useState<IInfoAttr>({
    jobGroup: "",
    aboutMe: "",
    instagramLink: "",
    githubLink: "",
    youtubeLink: "",
    blogLink: "",
  });

  const { userId } = useSelector((state: IRootState) => state.userReducer);
  const { profileId } = useSelector(
    (state: IRootState) => state.profileReducer
  );
  const profilePicture = useSelector(
    (state: IRootState) => state.profileReducer.profilePicture
  );
  const fileRef = useRef<HTMLInputElement>(null);

  const handleEdit = async () => {
    await editMutation.mutate(profileId);
  };
  const editProfile = async (profileId: string) => {
    const result = await frontApi.patch("/profile/edit", {
      profileId,
      jobGroup: info.jobGroup,
      aboutMe: info.aboutMe,
      instagramLink: info.instagramLink,
      githubLink: info.githubLink,
      youtubeLink: info.youtubeLink,
      blogLink: info.blogLink,
    });
    return result;
  };

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return false;
    }
    const result = await uploadMutation.mutate(e.target.files);
    return result;
  };

  const uploadPicture = async (files: FileList) => {
    const formData = new FormData();
    const [file] = files;
    formData.append("profilePicture", file);
    formData.append("profileId", profileId);
    const result = await formDataApi.patch("/profile/upload", formData);
    return result;
  };

  const editMutation = useMutation("editProfile", editProfile, {
    onSuccess(data) {
      const isError = typeof data !== "boolean" && "error" in data;
      if (isError) {
        dispatch(
          setNoticeInfo({
            isNotice: true,
            noticeMessage: "성공적으로 수정되었습니다",
          })
        );
      }

      setOpen(false);
    },
  });

  const uploadMutation = useMutation("upload", uploadPicture, {
    onSuccess: ({ data }) => {
      if (!("error" in data)) {
        dispatch(setProfilePicture(data.picture));
      }
    },
  });
  useEffect(() => {
    setInfo({
      jobGroup,
      aboutMe,
      instagramLink,
      githubLink,
      blogLink,
      youtubeLink,
    });
  }, [jobGroup, aboutMe, instagramLink, githubLink, blogLink, youtubeLink]);
  return (
    <Modal
      open={true}
      onClose={() => {
        setOpen(false);
      }}
      sx={{ borderBottom: "1px solid black" }}
    >
      <ModalDialog
        sx={{
          gap: "2rem",
          justifyContent: "center",
          alignItems: "center",
        }}
        layout="fullscreen"
        color="primary"
        size={"lg"}
      >
        <Box sx={{ display: "flex", gap: "1rem" }}>
          <Badge
            badgeContent={<AddIcon />}
            onClick={() => fileRef.current?.click()}
          >
            <Avatar
              sx={{ fontSize: "30px", "--Avatar-size": "75px" }}
              size="lg"
              color="primary"
              src={`${process.env.NEXT_PUBLIC_FRONT_API_URL}/images/profile/${profilePicture}`}
            >
              {userId && userId.slice(0, 2).toUpperCase()}
            </Avatar>
          </Badge>
          <input onChange={handleUpload} type="file" ref={fileRef} hidden />
        </Box>
        <TextField
          label="직무, 직책"
          value={info.jobGroup}
          size="medium"
          onChange={(e) => setInfo({ ...info, jobGroup: e.target.value })}
        />
        <TextField
          label="자기소개"
          multiline
          fullWidth
          maxRows={10}
          value={info.aboutMe}
          size="medium"
          onChange={(e) => setInfo({ ...info, aboutMe: e.target.value })}
        />
        <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Box
            sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
          >
            <Chip>소셜미디어 링크</Chip>
            <Tooltip
              variant="soft"
              color="primary"
              title="각 미디어의 아이디만 입력해주세요. 블로그는 전체 링크를 입력해주세요."
            >
              <Info />
            </Tooltip>
          </Box>

          <TextField
            size="small"
            label={<Instagram />}
            fullWidth
            onChange={(e) =>
              setInfo({ ...info, instagramLink: e.target.value })
            }
            value={info?.instagramLink}
          ></TextField>
          <TextField
            size="small"
            label={<GitHub />}
            fullWidth
            onChange={(e) => setInfo({ ...info, githubLink: e.target.value })}
            value={info?.githubLink}
          ></TextField>
          <TextField
            size="small"
            label={<YouTube />}
            fullWidth
            onChange={(e) => setInfo({ ...info, youtubeLink: e.target.value })}
            value={info?.youtubeLink}
          ></TextField>
          <TextField
            size="small"
            label={<Create />}
            fullWidth
            onChange={(e) => setInfo({ ...info, blogLink: e.target.value })}
            value={info?.blogLink}
          ></TextField>
        </Box>
        <Button onClick={handleEdit} sx={{ marginTop: "1rem" }} color="primary">
          수정
        </Button>
        <ModalClose
          onClick={() => {
            setOpen(false);
          }}
        />
      </ModalDialog>
    </Modal>
  );
}
