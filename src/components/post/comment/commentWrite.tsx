import { IRootState } from "@/dto/ReduxDto";
import frontApi from "@/modules/apiInstance";
import { Textarea } from "@mui/joy";
import { Box, Button, Typography } from "@mui/material";
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

  async function handleComments(): Promise<void> {
    const result = await commentWriteMutation.mutate();
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
      <Button
        sx={{ marginTop: "1rem" }}
        onClick={handleComments}
        variant="contained"
      >
        작성
      </Button>
    </Box>
  );
}
