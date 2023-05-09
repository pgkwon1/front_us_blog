import frontApi from "@/modules/apiInstance";
import apiClient from "@/modules/reactQueryInstance";
import { Box, Button } from "@mui/material";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { dehydrate, useMutation, useQuery } from "react-query";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import styled from "@/styles/posts/Posts.module.css";
import { IRootState } from "../dto/ReduxDto";
interface ILikeProps {
  likes: number;
  unlikes: number;
  likeProp: { like: boolean; unlike: boolean };
}
export default function Like({ likes, unlikes, likeProp }: ILikeProps) {
  const router = useRouter();
  const { id } = router.query;
  const likeRef = useRef<HTMLButtonElement>(null);
  const unlikeRef = useRef<HTMLButtonElement>(null);

  const [likeInfo, setLikeInfo] = useState({
    isLike: false,
    isUnlike: false,
    likeNum: 0,
    unlikeNum: 0,
  });

  useEffect(() => {
    setLikeInfo((current) => {
      return {
        ...current,
        isLike: likeProp.like,
        isUnlike: likeProp.unlike,
        likeNum: likes,
        unlikeNum: unlikes,
      };
    });
  }, [likes, unlikes, likeProp]);
  const { userId } = useSelector((state: IRootState) => state.userReducer);
  const handleLike = async (): Promise<void> => {
    await addLikeMutation.mutate();
    if (likeRef.current !== null) {
      likeRef.current.classList.add(styled.likeOn);
    }

    setLikeInfo((current) => {
      const { likeNum } = current;
      return {
        ...current,
        likeNum: likeNum + 1,
        isLike: true,
      };
    });
  };
  const handleUnLike = async (): Promise<void> => {
    await addUnlikeMutation.mutate();
    if (unlikeRef.current !== null) {
      unlikeRef.current.classList.add(styled.unlikeOn);
    }
    setLikeInfo((current) => {
      const { unlikeNum } = current;
      return {
        ...current,
        unlikeNum: unlikeNum + 1,
        isUnlike: true,
      };
    });
  };

  const handleLikeCancel = async (type: string): Promise<void> => {
    await likeCancelMutation.mutate(type);

    if (type === "LIKE") {
      setLikeInfo((current) => {
        const { likeNum } = current;
        return {
          ...current,
          likeNum: likeNum - 1,
          isLike: false,
        };
      });
      likeRef.current?.classList.remove("likeOn");
    } else if (type === "UNLIKE") {
      setLikeInfo((current) => {
        const { unlikeNum } = current;
        return {
          ...current,
          unlikeNum: unlikeNum - 1,
          isUnlike: false,
        };
      });
      unlikeRef.current?.classList.remove("unlikeOn");
    }
  };

  const addLike = async (): Promise<void> => {
    await frontApi.post(`/like/like`, {
      postId: id,
      userId,
    });
  };
  const addUnLike = async (): Promise<void> => {
    await frontApi.post(`/like/unlike`, {
      postId: id,
      userId,
    });
  };

  const likeCancel = async (type: string): Promise<void> => {
    await frontApi.post(`/like/likeCancel`, {
      type,
      postId: id,
      userId,
    });
  };

  const addLikeMutation = useMutation("addLike", addLike);
  const addUnlikeMutation = useMutation("addUnLike", addUnLike);

  const likeCancelMutation = useMutation(likeCancel, {
    mutationKey: "likeCancel",
  });
  return (
    <Box className={styled.likeWrap}>
      <Box className={styled.like}>
        <Button
          component="button"
          className={`${styled.likeButton} ${
            likeInfo.isLike ? styled.likeOn : ""
          }`}
          ref={likeRef}
          onClick={
            likeInfo.isLike ? () => handleLikeCancel("LIKE") : handleLike
          }
        >
          <ArrowUpwardIcon /> {likeInfo.likeNum}
        </Button>
        <Button
          component="button"
          sx={{ color: "black", fontSize: "18px;" }}
          className={`
            ${styled.likeButton},
            ${likeInfo.isUnlike ? styled.unlikeOn : ""},
          `}
          ref={unlikeRef}
          onClick={
            likeInfo.isUnlike ? () => handleLikeCancel("UNLIKE") : handleUnLike
          }
        >
          <ArrowDownwardIcon /> {likeInfo.unlikeNum}
        </Button>
      </Box>
    </Box>
  );
}
