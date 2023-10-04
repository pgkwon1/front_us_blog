import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { dehydrate, useInfiniteQuery, QueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentCategory } from "@/store/reducers/post";

import { Box } from "@mui/material";
import { ThreeDots } from "react-loader-spinner";

import styled from "@/styles/posts/Posts.module.css";
import frontApi from "@/modules/apiInstance";
import { IRootState } from "@/dto/ReduxDto";
import { IPostList } from "@/dto/PostDto";
import axios from "axios";
import Post from "@/components/post/post";
import {
  DEFAULT_REACT_QUERY_CACHE_TIME,
  DEFAULT_REACT_QUERY_STALE_TIME,
} from "@/constants/react-query.constants";

interface IPostByCategory {
  [key: string]: any;
}
export default function PostByCategory() {
  const [postList, setPostList] = useState<IPostByCategory>({
    잡담: [],
    기술: [],
    직장: [],
  });
  const [loading, setLoading] = useState(true);
  const [length, setLength] = useState(0);
  const router = useRouter();
  const category = router.query.category as string;
  const queryKey = useMemo(() => ["getPostByCategory", category], [category]);

  const lastPostRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const { currentCategory } = useSelector(
    (state: IRootState) => state.postReducer
  );

  async function getPostByCategory(page: number) {
    const result = await frontApi.get(`/post/category/${category}/${page}`);
    rendering(result.data.postList, category, false);
    return result.data;
  }

  const rendering = useCallback(
    (addList: IPostList[], category: string, isCache: boolean) => {
      // 캐시데이터로 렌더링
      if (isCache === true) {
        setPostList((prevList) => {
          return {
            ...prevList,
            [category]: addList,
          };
        });
        //  response data로 렌더링
      } else {
        setPostList((prevList) => {
          return {
            ...prevList,
            [category]: prevList[category].concat(addList),
          };
        });
      }
      setLength(addList.length);
      setLoading(false);
      dispatch(setCurrentCategory(category));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  /**
   * @data: 캐시데이터
   * @fetchNextPage: 다음 페이지 데이터를 가져오는 함수.
   * @refetch: 현재 페이지의 데이터를 다시 가져오는 함수.
   * @hasNextPage: 불러올 다음 페이지의 데이터가 있는지 여부. getNextPageParam에서 undefined를 리턴해주면 false로 설정됨.
   * @isStale: stale 타임(데이터 만료시간)이 지났는지 여부
   */
  const { data, fetchNextPage, refetch, hasNextPage, isStale } =
    useInfiniteQuery(
      queryKey,
      ({ pageParam = 1 }) => getPostByCategory(pageParam),
      {
        getNextPageParam: (lastPage, allPages) => {
          const nextPage = allPages.length + 1;
          return lastPage.postList.length !== 0 ? nextPage : undefined;
        },
        staleTime: DEFAULT_REACT_QUERY_STALE_TIME,
        cacheTime: DEFAULT_REACT_QUERY_CACHE_TIME,
        refetchOnMount: false,
      }
    );

  useEffect(() => {
    if (isStale === false) {
      // 캐시 데이터가 남아있지만 카테고리가 변경 되었을때의 렌더링 처리
      let addList: IPostList[] = [];
      data?.pages.map((page) => {
        addList = addList.concat(page.postList);
      });
      rendering(addList, category, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  // ref가 포커싱 될 때 다음 페이지 데이터 fetching.
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage]
  );

  // 옵저버 등록
  useEffect(() => {
    // 카테고리 바꿨다가 다시 돌아오면 lastPostRef 가 null 되는점 해결하기
    if (lastPostRef.current instanceof HTMLDivElement) {
      const lastElement: HTMLDivElement = lastPostRef.current;
      const observer: IntersectionObserver = new IntersectionObserver(
        handleObserver,
        {
          threshold: 0,
        }
      );
      if (lastElement !== null) observer.observe(lastElement);
      return () => {
        if (lastElement !== null) observer.unobserve(lastElement);
      };
    }
  }, [category, length, lastPostRef, handleObserver]);

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
          {postList[category].map((post: IPostList, index: number) => {
            return <Post post={post} key={index} />;
          })}
          {length > 9 ? <Box ref={lastPostRef}>Loading..</Box> : ""}
        </Box>
      )}
    </Box>
  );
}
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { category, page } = context.query;
  const client = new QueryClient();
  client.prefetchInfiniteQuery(["getPostByCategory", category], async () => {
    const result = await axios.get(`/post/category/${category}/${page}`);
    return result.data.postList;
  });
  return {
    props: {
      dehydrateState: dehydrate(client),
    },
  };
}
