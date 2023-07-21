import { IRootState } from "@/dto/ReduxDto";
import frontApi from "@/modules/apiInstance";
import { Textarea } from "@mui/joy";
import { Alert, Box, Button, FormControl, Typography } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  async function handleComments(): Promise<void | boolean> {
    await commentWriteMutation.mutate();
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
      <form onSubmit={handleSubmit(handleComments)}>
        <Typography>댓글</Typography>
        <Textarea
          {...register("comments", { required: true })}
          onChange={(e) => setContents(e.target.value)}
          minRows={3}
          value={contents}
          {...(errors.comments && {
            error: true,
            placeholder: "댓글 내용을 입력해주세요.",
          })}
        />
        <Button type="submit" sx={{ marginTop: "1rem" }} variant="contained">
          작성
        </Button>
      </form>
    </Box>
  );
}
