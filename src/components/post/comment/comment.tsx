import {
  ICommentResponse,
  IEditCommentDto,
  IEditCommentRequestDto,
} from "@/dto/posts/Comments";
import frontApi from "@/modules/apiInstance";
import { Box, Button, Input, Popover, Typography } from "@mui/material";
import { Avatar, IconButton } from "@mui/joy";
import { Edit, Delete, Close, EditAttributes } from "@mui/icons-material";

import moment from "moment-timezone";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import CommentWrite from "./commentWrite";
import styled from "@/styles/posts/Comments.module.css";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "@/dto/ReduxDto";
import { KeyboardArrowDown } from "@mui/icons-material";
import { setNoticeInfo } from "@/store/reducers/global";

export default function Comment() {
  const router = useRouter();
  const postId = router.query.id as string;
  const [comment, setComment] = useState<ICommentResponse>({
    count: 0,
    commentList: [],
  });
  const [editInfo, setEditInfo] = useState<IEditCommentDto>({
    id: "",
    editContents: "",
    index: 0,
  });

  const editRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef(null);

  const { userId } = useSelector((state: IRootState) => state.userReducer);
  const dispatch = useDispatch();

  async function getComments(): Promise<ICommentResponse> {
    const result = await frontApi.get(`/comment/${postId}`);
    return result.data;
  }
  function updateCommentsList(): void {
    refetch();
  }
  const { data, isLoading, refetch } = useQuery(
    ["getComment", postId],
    getComments,
    {
      staleTime: Number(process.env.NEXT_PUBLIC_POST_STALE_TIME),
      cacheTime: Number(process.env.NEXT_PUBLIC_POST_CACHE_TIME),
    }
  );
  const handleEdit = async (commentsId: string) => {
    await updateMutation.mutate({
      id: commentsId,
      postId,
      editContents: editInfo.editContents,
    });
  };

  const updateComment = async (commentData: IEditCommentRequestDto) => {
    const result = await frontApi.patch(`/comment/update`, commentData);
    return result.data;
  };

  const updateMutation = useMutation("updateComment", updateComment, {
    onSuccess(data) {
      dispatch(
        setNoticeInfo({
          isNotice: true,
          noticeMessage: "성공적으로 수정되었습니다.",
        })
      );
      const { editContents, index } = editInfo;

      comment.commentList[index].contents = editContents;
      setEditInfo({
        id: "",
        editContents: "",
        index: 0,
      });
    },
  });

  const handleDelete = async (commentsId: string, index: number) => {
    await deleteMutation.mutate(commentsId);
    comment.commentList.splice(index, 1);
    comment.count -= 1;
  };
  const deleteComment = async (commentsId: string) => {
    const result = await frontApi.delete("/comment/delete", {
      data: {
        id: commentsId,
        postId,
      },
    });
    return result.data;
  };
  const deleteMutation = useMutation("deleteComment", deleteComment, {
    onSuccess(data) {
      dispatch(
        setNoticeInfo({
          isNotice: true,
          noticeMessage: "성공적으로 삭제되었습니다.",
        })
      );
    },
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
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        alignContent: "center",
                      }}
                    >
                      <Box>{comment.userId}</Box>
                    </Box>
                  </Box>
                  <Box>{moment(comment.createdAt).utc().fromNow()}</Box>
                </Box>
                {userId === comment.userId ? (
                  <Box sx={{ marginLeft: "auto" }}>
                    <IconButton
                      onClick={() => {
                        setEditInfo({
                          id: comment.id,
                          editContents: comment.contents,
                          index,
                        });
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(comment.id, index)}>
                      <Delete />
                    </IconButton>
                  </Box>
                ) : (
                  ""
                )}
              </Box>
              <Box className={styled.commentsContents}>
                {editInfo.id === comment.id ? (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Input
                      value={editInfo.editContents}
                      ref={inputRef}
                      onChange={(e) =>
                        setEditInfo({
                          ...editInfo,
                          editContents: e.target.value,
                        })
                      }
                    />
                    <IconButton onClick={() => handleEdit(comment.id)}>
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() =>
                        setEditInfo({ id: "", editContents: "", index: 0 })
                      }
                    >
                      <Close />
                    </IconButton>
                  </Box>
                ) : (
                  <Typography>{comment.contents}</Typography>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
