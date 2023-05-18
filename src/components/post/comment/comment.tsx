import { IComment, ICommentResponse } from "@/dto/posts/Comments";
import frontApi from "@/modules/apiInstance";
import { Avatar, Box, Typography } from "@mui/material";
import moment from "moment-timezone";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import CommentWrite from "./commentWrite";

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

  const { data, isLoading } = useQuery(["getComment", id], getComments, {
    staleTime: Number(process.env.NEXT_PUBLIC_POST_STALE_TIME),
    cacheTime: Number(process.env.NEXT_PUBLIC_POST_CACHE_TIME),
  });

  useEffect(() => {
    if (isLoading === false && data !== undefined) {
      setComment({
        count: data.count,
        commentList: data.commentList,
      });
    }
  }, [isLoading, data]);

  return (
    <Box
      sx={{
        marginTop: "1rem",
        padding: "2.5rem",
        background: "#fff",
        border: "1px solid grey;",
      }}
      className={"commentWrap"}
    >
      {isLoading ? (
        "Loading..."
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          <CommentWrite />

          <Typography>댓글 {comment.count}</Typography>
          {comment.commentList.map((comment, index) => (
            <Box key={index}>
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
                <Box
                  sx={{
                    display: "flex",
                    gap: "0.3rem",
                    flexDirection: "column",
                  }}
                >
                  <Box>{comment.userId}</Box>
                  <Box>{moment(comment.createdAt).utc().fromNow()}</Box>
                </Box>
              </Box>
              {comment.id}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
