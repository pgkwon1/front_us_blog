import { ReactElement, useCallback, useEffect, useRef, useState } from "react";
import { GetServerSidePropsContext } from "next";
import { dehydrate, useInfiniteQuery } from "react-query";
import { useRouter } from "next/router";
import { ThreeDots } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";

import { Box, SvgIconProps } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import CodeIcon from "@mui/icons-material/Code";
import CoffeeIcon from "@mui/icons-material/Coffee";
import PersonIcon from "@mui/icons-material/Person";
import styled from "@/styles/posts/Posts.module.css";

import { Category, IPostByTagPage, IPostList } from "@/dto/PostDto";
import frontApi from "@/modules/apiInstance";
import apiClient from "@/modules/reactQueryInstance";
import { setCurrentTag } from "@/store/reducers/post";
import { IRootState } from "@/dto/ReduxDto";

import Error from "next/error";
import axios from "axios";
import Post from "@/components/post/post";

export default function PostbyTag() {
  const router = useRouter();
  const [postList, setPostList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [length, setLength] = useState(0);
  const lastPostRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const { tag } = router.query;
  const { currentTag } = useSelector((state: IRootState) => state.postReducer);

  async function getPostByTag(page: number) {
    const result = await frontApi.get(`/post/tag/${tag}/${page}`);
    dispatch(setCurrentTag(tag));
    setPostList((prevList) => prevList.concat(result.data.postList));
    setLength(result.data.postList);
    setLoading(false);
    return result.data;
  }

  const { data, refetch, hasNextPage, fetchNextPage, isStale } =
    useInfiniteQuery<IPostByTagPage, Error, IPostByTagPage>(
      "getPostByTag",
      ({ pageParam = 1 }) => getPostByTag(pageParam),

      {
        getNextPageParam(lastPage: IPostByTagPage, allPages) {
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
      if (currentTag !== tag) {
        // 캐시 데이터가 남아있으면서 태그가 달라졌을 경우 다시 데이터를 가져옴

        refetch();
      } else {
        // 캐시 데이터가 남아있으면서 태그가 그대로일경우 캐시데이터로 렌더링

        data?.pages.map((post) => {
          setPostList((prevList: any) => prevList.concat(post.postList));
          setLoading(false);
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tag]);

  useEffect(() => {
    if (lastPostRef.current instanceof HTMLElement) {
      const lastElement: HTMLElement = lastPostRef.current;
      const observer = new IntersectionObserver(handleObserver, {
        threshold: 0,
      });
      observer.observe(lastElement);
      return () => observer.unobserve(lastElement);
    }
  }, [loading, fetchNextPage, hasNextPage, handleObserver]);
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
  const { tag, page } = context.query;
  apiClient.prefetchQuery("getPostByTag", async () => {
    const result = await axios.get(`/post/tag/${tag}/${page}`);
    return result.data.postList;
  });
  return {
    props: {
      dehydrateState: dehydrate(apiClient),
    },
  };
}
