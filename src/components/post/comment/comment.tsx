import { ICommentResponse } from "@/dto/posts/Comments";
import frontApi from "@/modules/apiInstance";
import { Box, Typography } from "@mui/material";
import { Avatar } from "@mui/joy";

import moment from "moment-timezone";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import CommentWrite from "./commentWrite";
import styled from "@/styles/posts/Comments.module.css";

export default function Comment() {
  const router = useRouter();
  const { id } = router.query;
  const [comment, setComment] = useState<ICommentResponse>({
    count: 0,
    commentList: [],
  });

  async function getComments(): Promise<ICommentResponse> {
    const result = await frontApi.get(`/comment/${id}`);
    return result.data;
  }
  function updateCommentsList(): void {
    refetch();
  }
  const { data, isLoading, refetch } = useQuery(
    ["getComment", id],
    getComments,
    {
      staleTime: Number(process.env.NEXT_PUBLIC_POST_STALE_TIME),
      cacheTime: Number(process.env.NEXT_PUBLIC_POST_CACHE_TIME),
    }
  );

  useEffect(() => {
    if (isLoading === false && data !== undefined) {
      setComment({
        count: data.count,
        commentList: data.commentList,
      });
    }
  }, [isLoading, data]);

  return (
    <Box className={styled.commentsWrap}>
      <Box>
        <CommentWrite updateCommentList={updateCommentsList} />
      </Box>
      {isLoading ? (
        "Loading..."
      ) : (
        <Box className={styled.commentsList}>
          <Typography variant="h5">댓글 {comment.count}</Typography>
          {comment.commentList.map((comment, index) => (
            <Box className={styled.comment} key={index}>
              <Box
                sx={{
                  fontSize: "13px",
                  display: "flex",
                  flexDirection: "row",
                  gap: "0.8rem",
                }}
              >
                <Avatar color="primary" variant="soft">
                  {comment.userId && comment.userId.slice(0, 2).toUpperCase()}
                </Avatar>
                <Box className={styled.commentsInfo}>
                  <Box>{comment.userId}</Box>
                  <Box>{moment(comment.createdAt).utc().fromNow()}</Box>
                </Box>
              </Box>
              <Box className={styled.commentsContents}>{comment.contents}</Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
