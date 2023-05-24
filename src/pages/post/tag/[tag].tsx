import {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { GetServerSidePropsContext } from "next";
import { dehydrate, useInfiniteQuery } from "react-query";
import { useRouter } from "next/router";
import { ThreeDots } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";

import { Box } from "@mui/material";
import styled from "@/styles/posts/Posts.module.css";

import { IPostList, IPostListResponse } from "@/dto/PostDto";
import frontApi from "@/modules/apiInstance";
import apiClient from "@/modules/reactQueryInstance";
import { setCurrentTag } from "@/store/reducers/post";
import { IRootState } from "@/dto/ReduxDto";

import Error from "next/error";
import axios from "axios";
import Post from "@/components/post/post";

export default function PostbyTag() {
  const router = useRouter();
  const [postList, setPostList] = useState<IPostList[]>([]);
  const [loading, setLoading] = useState(true);
  const [length, setLength] = useState(0);
  const lastPostRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const tag = router.query.tag as string;
  const { currentTag } = useSelector((state: IRootState) => state.postReducer);
  const queryKey = useMemo(() => ["getPostByTag", tag], [tag]);

  async function getPostByTag(page: number) {
    const result = await frontApi.get(`/post/tag/${tag}/${page}`);
    rendering(result.data.postList, tag, false);
    return result.data;
  }

  function rendering(addList: IPostList[], tag: string, isCache: boolean) {
    if (isCache === true) {
      setPostList(addList);
    } else {
      tag !== currentTag
        ? setPostList(addList)
        : setPostList((prevList) => prevList.concat(addList));
    }
    // setPostList((prevList) => prevList.concat(addList));
    setLength(addList.length);
    setLoading(false);
    dispatch(setCurrentTag(tag));
  }
  const { data, hasNextPage, fetchNextPage, isStale } = useInfiniteQuery<
    IPostListResponse,
    Error,
    IPostListResponse
  >(
    queryKey,
    ({ pageParam = 1 }) => getPostByTag(pageParam),

    {
      getNextPageParam(lastPage: IPostListResponse, allPages) {
        const nextPage = allPages.length + 1;
        if ("postList" in lastPage && lastPage.postList.length !== 0)
          return nextPage;
        else undefined;
      },
      staleTime: 120 * 1000,
      cacheTime: 120 * 1000,
    }
  );

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
    if (isStale === false) {
      let addList: IPostList[] = [];
      data?.pages.map((page) => {
        addList = addList.concat(page.postList);
      });
      rendering(addList, tag, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tag]);

  useEffect(() => {
    if (lastPostRef.current instanceof HTMLDivElement) {
      const lastElement: HTMLDivElement = lastPostRef.current;
      const observer = new IntersectionObserver(handleObserver, {
        threshold: 0,
      });
      observer.observe(lastElement);
      return () => observer.unobserve(lastElement);
    }
  }, [tag, length, lastPostRef, handleObserver]);
  return (
    <Box>
      {loading ? (
        <ThreeDots
          height={240}
          width={240}
          color="black"
          visible={true}
          wrapperStyle={{ justifyContent: "center" }}
          ariaLabel="oval-loading"
        />
      ) : (
        <Box className={styled.postWrap}>
          {postList.map((post: IPostList, index: number) => {
            return <Post post={post} key={index} />;
          })}
          {length > 9 ? <Box ref={lastPostRef}>Loading..</Box> : ""}
        </Box>
      )}
    </Box>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { tag, page } = context.query;
  apiClient.prefetchQuery(["getPostByTag", tag], async () => {
    const result = await axios.get(`/post/tag/${tag}/${page}`);
    return result.data.postList;
  });
  return {
    props: {
      dehydrateState: dehydrate(apiClient),
    },
  };
}
