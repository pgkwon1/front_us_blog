import { ChangeEvent, useRef } from "react";
import { useMutation } from "react-query";

import { formDataApi } from "@/modules/apiInstance";

import DateRangeIcon from "@mui/icons-material/DateRange";
import AddIcon from "@mui/icons-material/Add";

import { Chip } from "@mui/joy";
import { Box, Typography, InputLabel, Paper, IconButton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import styled from "@/styles/member/Project.module.css";
import {
  setProjectThumb,
  setProjectPhoto1,
  setProjectPhoto2,
  setProjectPhoto3,
} from "@/store/reducers/project";
import { IRootState } from "@/dto/ReduxDto";
import { setNoticeInfo } from "@/store/reducers/global";

export default function ProjectPhoto() {
  const thumbRef = useRef<HTMLInputElement>(null);
  const photo1Ref = useRef<HTMLInputElement>(null);
  const photo2Ref = useRef<HTMLInputElement>(null);
  const photo3Ref = useRef<HTMLInputElement>(null);

  /**
   * 상태값을 객체 구조분해할당으로 가져오게 되면 dispatch 될 때
   * 값이 변경되지 않아도 불필요한 재렌더링이 발생하므로(어떤 값이 변경됐는지 안 됐는지 구분할 수 없으므로 재 렌더링이 되어버림)
   * useSelector를 여러번 사용
   */
  const projectThumb = useSelector(
    (state: IRootState) => state.projectReducer.projectThumb
  );
  const projectPhoto1 = useSelector(
    (state: IRootState) => state.projectReducer.projectPhoto1
  );
  const projectPhoto2 = useSelector(
    (state: IRootState) => state.projectReducer.projectPhoto2
  );
  const projectPhoto3 = useSelector(
    (state: IRootState) => state.projectReducer.projectPhoto3
  );
  const dispatch = useDispatch();

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return false;
    }
    await uploadMutation.mutate({
      file: e.target?.files,
      name: e.target.getAttribute("name") as string,
    });
  };
  const projectUpload = async (uploadData: {
    file: FileList;
    name: string;
  }) => {
    const formData = new FormData();
    const { file, name } = uploadData;
    formData.append(name, file[0]);
    formData.append("name", name);
    const result = await formDataApi.post(`/project/upload/tmp`, formData);
    return result.data;
  };

  const uploadMutation = useMutation("projectPhotoUpload", projectUpload, {
    onSuccess(data, variables) {
      if (data.fileName) {
        dispatch(
          setNoticeInfo({
            isNotice: true,
            noticeMessage: "성공적으로 업로드 되었습니다.",
          })
        );
        switch (variables.name) {
          case "projectThumb":
            dispatch(setProjectThumb(data.fileName));
            break;
          case "projectPhoto1":
            dispatch(setProjectPhoto1(data.fileName));
            break;
          case "projectPhoto2":
            dispatch(setProjectPhoto2(data.fileName));
            break;
          case "projectPhoto3":
            dispatch(setProjectPhoto3(data.fileName));
            break;
        }
      }
    },
  });
  return (
    <Box>
      <InputLabel htmlFor="photo">
        <Chip startDecorator={<DateRangeIcon />}>프로젝트 사진</Chip>
      </InputLabel>
      <Box className={styled.writePhotoContainer}>
        {[
          { name: "projectThumb", title: "썸네일", ref: thumbRef },
          { name: "projectPhoto1", title: "사진 1", ref: photo1Ref },
          { name: "projectPhoto2", title: "사진 2", ref: photo2Ref },
          { name: "projectPhoto3", title: "사진 3", ref: photo3Ref },
        ].map((photo, index) => (
          <Paper className={styled.writePhoto} key={index} elevation={3}>
            <Typography>{photo.title}</Typography>
            <IconButton
              color="inherit"
              onClick={() => photo.ref.current?.click()}
            >
              <AddIcon />
            </IconButton>
            <input
              type="file"
              onChange={handleUpload}
              name={photo.name}
              hidden
              ref={photo.ref}
            />
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
