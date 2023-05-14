import { ReactElement, useCallback, useEffect, useRef, useState } from "react";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { dehydrate, useInfiniteQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentCategory } from "@/store/reducers/post";

import { Box, SvgIconProps } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import CodeIcon from "@mui/icons-material/Code";
import CoffeeIcon from "@mui/icons-material/Coffee";
import PersonIcon from "@mui/icons-material/Person";
import { ThreeDots } from "react-loader-spinner";

import styled from "@/styles/posts/Posts.module.css";
import frontApi from "@/modules/apiInstance";
import apiClient from "@/modules/reactQueryInstance";
import { IRootState } from "@/dto/ReduxDto";
import { Category, IPostList } from "@/dto/PostDto";
import axios from "axios";
import Post from "@/components/post/post";

export default function PostByCategory() {
  const [postList, setPostList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [length, setLength] = useState(0);
  const router = useRouter();
  const { category } = router.query;
  const lastPostRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const { currentCategory } = useSelector(
    (state: IRootState) => state.postReducer
  );
  async function getPostByCategory(page: number) {
    const result = await frontApi.get(`/post/category/${category}/${page}`);
    setPostList((prevList) => prevList.concat(result.data.postList));
    setLength(result.data.postList.length);
    setLoading(false);
    dispatch(setCurrentCategory(category));
    return result.data;
  }
  /**
   * @data: 캐시데이터
   * @fetchNextPage: 다음 페이지 데이터를 가져오는 함수.
   * @refetch: 현재 페이지의 데이터를 다시 가져오는 함수.
   * @hasNextPage: 불러올 다음 페이지의 데이터가 있는지 여부. getNextPageParam에서 undefined를 리턴해주면 false로 설정됨.
   * @isStale: stale 타임(데이터 만료시간)이 지났는지 여부
   */
  const { data, fetchNextPage, refetch, hasNextPage, isStale } =
    useInfiniteQuery(
      "getPostByCategory",
      ({ pageParam = 1 }) => getPostByCategory(pageParam),
      {
        getNextPageParam: (lastPage, allPages) => {
          const nextPage = allPages.length + 1;
          return lastPage.postList.length !== 0 ? nextPage : undefined;
        },
        staleTime: 120000,
        cacheTime: 120000,
        refetchOnMount: false,
      }
    );

  useEffect(() => {
    if (isStale === false) {
      if (category !== currentCategory) {
        // 캐시 데이터가 남아있지만 카테고리가 변경 되었을때 refetch 처리
        setPostList((current) => []);
        refetch();
      } else {
        let listLength = 0;
        data?.pages.map((page) => {
          setPostList((prevList) => prevList.concat(page.postList));
          listLength += page.postList.length;
        });
        setLoading(false);
        setLength(listLength);
      }
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
    if (lastPostRef.current instanceof HTMLElement === true) {
      const lastElement = lastPostRef.current;
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
  }, [loading, handleObserver]);

  const getCategoryIcon = (category: Category): ReactElement<SvgIconProps> => {
    switch (category) {
      case "직장": {
        return <BusinessIcon />;
      }
      case "잡담": {
        return <CoffeeIcon />;
      }
      case "기술": {
        return <CodeIcon />;
      }
      default: {
        return <PersonIcon />;
      }
    }
  };
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
  const { category, page } = context.query;
  apiClient.prefetchInfiniteQuery("getPostByCategory", async () => {
    const result = await axios.get(`/post/category/${category}/${page}`);
    return result.data.postList;
  });
  return {
    props: {
      dehydrateState: dehydrate(apiClient),
    },
  };
}
