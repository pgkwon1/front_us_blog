import { useCallback, useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "react-query";
import Error from "next/error";

import { Box, Skeleton } from "@mui/material";
import styled from "@/styles/posts/Posts.module.css";

import { IPostListResponse, IPostList } from "@/dto/PostDto";
import frontApi from "@/modules/apiInstance";
import Post from "./post";
import Link from "next/link";

export default function Posts() {
  const [postList, setPostList] = useState([]);
  const [loading, setLoading] = useState(true);
  const lastPostRef = useRef<HTMLDivElement>(null);
  const getPostList = async (page: number): Promise<IPostListResponse> => {
    page = page ?? 1;
    const result = await frontApi.get(`/page/${page}`);
    setPostList((prevList) => prevList.concat(result.data.postList));
    result.status === 200 && setLoading(false);
    return result.data;
  };

  const { data, isSuccess, hasNextPage, fetchNextPage, isStale } =
    useInfiniteQuery<IPostListResponse, Error, IPostListResponse>(
      "getPostList",
      ({ pageParam = 1 }) => getPostList(pageParam),
      {
        getNextPageParam: (lastPage: IPostListResponse, allPages) => {
          const nextPage: any = allPages.length + 1;

          return lastPage.postList.length !== 0 ? nextPage : undefined;
        },
        staleTime: 120 * 1000,
        cacheTime: 120 * 1000,
        refetchOnWindowFocus: true,
      }
    );
  // staletime(데이터만료시간) 이 안지났을 경우 캐시된 데이터로 렌더링.
  useEffect(() => {
    if (isStale === false) {
      data?.pages.map((page: any) => {
        setPostList((prevList) => prevList.concat(page.postList));
      });
      setLoading(false);
    }
  }, []);
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      // target이 포커싱 되었을때 불러올 데이터가 있을때
      if (target.isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage]
  );
  useEffect(() => {
    if (isSuccess === false) return;
    const page = data?.pages.length;
  }, [data, isSuccess, fetchNextPage, hasNextPage, handleObserver]);

  useEffect(() => {
    if (lastPostRef.current instanceof HTMLElement === true) {
      const lastElement = lastPostRef.current;
      const observer = new IntersectionObserver(handleObserver, {
        threshold: 0,
      });
      if (lastElement !== null) observer.observe(lastElement);
      return () => {
        if (lastElement !== null) observer.unobserve(lastElement);
      };
    }
  }, [loading, fetchNextPage, hasNextPage, handleObserver]);

  return (
    <Box>
      {loading ? (
        <Skeleton variant="rectangular" width={210} height={118} />
      ) : (
        <Box className={styled.postWrap}>
          <Link href={"/post/write"}>
            <Box
              sx={{
                padding: "1rem",
                background: "#fff",
                marginBottom: "1rem",
                borderRadius: "10px",
              }}
            >
              <Box
                sx={{
                  color: "#857d7d",
                  padding: "1.5rem",
                  background: "#e9e9e9",
                }}
              >
                오늘 공부한 것을 기록해보세요!
              </Box>
            </Box>
          </Link>
          {postList.map((post: IPostList, index: number) => {
            return <Post post={post} key={index} />;
          })}
          <Box ref={lastPostRef}></Box>
        </Box>
      )}
    </Box>
  );
}
