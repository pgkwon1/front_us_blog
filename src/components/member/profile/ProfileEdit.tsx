import frontApi, { formDataApi } from "@/modules/apiInstance";
import { Avatar, Badge, Button, ModalClose, ModalDialog } from "@mui/joy";
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

interface ISkillsEditProp {
  jobGroup: string;
  aboutMe: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
interface IInfoAttr {
  jobGroup: string;
  aboutMe: string;
}
export default function ProfileEdit({
  jobGroup,
  aboutMe,
  setOpen,
}: ISkillsEditProp) {
  const dispatch = useDispatch();
  const [info, setInfo] = useState<IInfoAttr>({
    jobGroup: "",
    aboutMe: "",
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
      userId,
      profileId,
      jobGroup: info.jobGroup,
      aboutMe: info.aboutMe,
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
    onSuccess: () => {
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
    });
  }, [jobGroup, aboutMe]);
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
