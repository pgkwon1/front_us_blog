import Post from "@/components/post/post";
import {
  DEFAULT_REACT_QUERY_CACHE_TIME,
  DEFAULT_REACT_QUERY_STALE_TIME,
} from "@/constants/react-query.constants";
import { IRootState } from "@/dto/ReduxDto";
import frontApi from "@/modules/apiInstance";
import { Card, Typography } from "@mui/joy";
import { Box, Stack } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "react-query";
import { useSelector } from "react-redux";

import styled from "@/styles/posts/Posts.module.css";
import { IPostList, IPostListResponse } from "@/dto/PostDto";

export default function UserPostList() {
  const [postList, setPostList] = useState<IPostList[]>([]);
  const [page, setPage] = useState(1);
  const [length, setLength] = useState(0);
  const userId = useSelector(
    (state: IRootState) => state.profileReducer.profileUserId
  );
  const lastPostRef = useRef<HTMLDivElement>(null);
  const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery(
    ["getUserPostList", userId],
    ({ pageParam = 1 }) => getUserPostList(pageParam),
    {
      getNextPageParam: (lastPage: IPostListResponse, allPages) => {
        const nextPage = allPages.length + 1;
        return lastPage.postList.length >= 10 ? nextPage : undefined;
      },
      staleTime: DEFAULT_REACT_QUERY_STALE_TIME,
      cacheTime: DEFAULT_REACT_QUERY_CACHE_TIME,
      keepPreviousData: true,
    }
  );

  const getUserPostList = async (page: number) => {
    setPage(page);
    const result = await frontApi.get(`/post/author/${userId}/${page}`);
    return result.data;
  };
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;

      if (target.isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage]
  );

  useEffect(() => {
    setLength(data?.pages[page - 1].postList.length);
    if (isLoading === false && data !== undefined) {
      setPostList(data.pages.flatMap((list) => list.postList));
    }
  }, [isLoading, data]);

  useEffect(() => {
    if (lastPostRef.current instanceof HTMLDivElement) {
      const lastElement: HTMLDivElement = lastPostRef.current;
      const observer: IntersectionObserver = new IntersectionObserver(
        handleObserver,
        {
          threshold: 0,
        }
      );
      if (lastElement !== null) observer.observe(lastElement);
      return () => observer.unobserve(lastElement);
    }
  }, [length]);

  return (
    <Box className={styled.postWrap}>
      {isLoading
        ? ""
        : postList.map((post, index) => {
            return (
              <Box key={index}>
                <Post post={post} />
              </Box>
            );
          })}
      <Box ref={lastPostRef}>Loading..</Box>
    </Box>
  );
}
