import { IRootState } from "@/dto/ReduxDto";
import frontApi from "@/modules/apiInstance";
import { Textarea } from "@mui/joy";
import { Alert, Box, Button, FormControl, Typography } from "@mui/material";
import { useState } from "react";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";

interface ICommentWriteProps {
  updateCommentList: () => void;
}
export default function CommentWrite({
  updateCommentList,
}: ICommentWriteProps) {
  const { currentPostId } = useSelector(
    (state: IRootState) => state.postReducer
  );
  const { userId } = useSelector((state: IRootState) => state.userReducer);

  const [contents, setContents] = useState("");
  const [errorInfo, setErrorInfo] = useState({
    error: false,
    message: "",
  });

  async function handleComments(): Promise<void | boolean> {
    if (!contents) {
      setErrorInfo({
        error: true,
        message: "댓글을 입력해주세요",
      });
      return false;
    }
    const result = await commentWriteMutation.mutate();
    setErrorInfo({
      error: false,
      message: "",
    });
  }
  async function writeComments(): Promise<void> {
    await frontApi.post(`/comment/write`, {
      userId,
      postId: currentPostId,
      contents,
    });
  }
  const commentWriteMutation = useMutation(
    ["writeComment", currentPostId],
    writeComments,
    {
      onSuccess: () => {
        updateCommentList();
        setContents("");
      },
    }
  );

  return (
    <Box>
      <Typography>댓글</Typography>
      <Textarea
        onChange={(e) => setContents(e.target.value)}
        minRows={3}
        value={contents}
      />
      {errorInfo.error ? (
        <Alert color="error" sx={{ marginTop: "1rem" }}>
          {errorInfo.message}
        </Alert>
      ) : (
        ""
      )}
      <Button
        onClick={handleComments}
        sx={{ marginTop: "1rem" }}
        variant="contained"
      >
        작성
      </Button>
    </Box>
  );
}
