import { IRootState } from "@/dto/ReduxDto";
import frontApi from "@/modules/apiInstance";
import { Textarea } from "@mui/joy";
import { Alert, Box, Button, Snackbar, Typography } from "@mui/material";
import { useRef, useState } from "react";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";

export default function CommentWrite() {
  const inputRef = useRef<HTMLInputElement>(null);

  const { currentPostId } = useSelector(
    (state: IRootState) => state.postReducer
  );
  const { userId } = useSelector((state: IRootState) => state.userReducer);

  async function handleComments(): Promise<void> {
    const comments = inputRef.current?.value;
    if (!comments) {
    }

    const result = await commentWriteMutation.mutate();
  }
  async function writeComments(): Promise<void> {
    const comments = inputRef.current?.value;
    await frontApi.post(`/comment/write`, {
      postId: currentPostId,
      comments: "test",
    });
  }
  const commentWriteMutation = useMutation(
    ["writeComment", currentPostId],
    writeComments
  );
  return (
    <Box>
      <Typography>댓글</Typography>
      <Textarea ref={inputRef} minRows={3} />
      <Button onClick={handleComments} variant="contained">
        작성
      </Button>
    </Box>
  );
}
