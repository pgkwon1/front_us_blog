import { ReactElement, useCallback, useEffect, useRef, useState } from "react";
import { dehydrate, useInfiniteQuery } from "react-query";
import Link from "next/link";
import Error from "next/error";

import { Box, Chip, ListItem, Skeleton, SvgIconProps } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import CodeIcon from "@mui/icons-material/Code";
import CoffeeIcon from "@mui/icons-material/Coffee";
import PersonIcon from "@mui/icons-material/Person";
import styled from "../../styles/posts/Posts.module.css";

import moment from "moment-timezone";

import {
  Category,
  IPostByIndexPage,
  IPostByTags,
  IPostDto,
} from "../dto/PostDto";
import frontApi from "@/modules/apiInstance";
import apiClient from "@/modules/reactQueryInstance";

export default function Posts() {
  const [postList, setPostList] = useState([]);
  const [loading, setLoading] = useState(true);
  const lastPostRef = useRef<HTMLDivElement>(null);
  useEffect(() => {}, []);
  const getPostList = async (page: number): Promise<IPostByIndexPage> => {
    page = page ?? 1;
    const result = await frontApi.get(`/page/${page}`);
    setPostList((prevList) => prevList.concat(result.data.postList));
    result.status === 200 && setLoading(false);
    return result.data;
  };

  const { data, isSuccess, hasNextPage, fetchNextPage, isStale } =
    useInfiniteQuery<IPostByIndexPage, Error, IPostByIndexPage>(
      "postList",
      ({ pageParam = 1 }) => getPostList(pageParam),
      {
        getNextPageParam: (lastPage: IPostByIndexPage, allPages) => {
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
  }, [isStale, data?.pages]);
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
        <Skeleton variant="rectangular" width={210} height={118} />
      ) : (
        <Box className={styled.postWrap}>
          {postList.map((post: IPostDto, index: number) => {
            return (
              <Box key={index} className={styled.post}>
                <Link href={`/post/${post.id}`}>
                  <Box className={styled.postInfo}>
                    <Box className={styled.postCategory}>
                      <Chip
                        icon={getCategoryIcon(post.category)}
                        label={String(post.category)}
                      ></Chip>
                    </Box>
                    <Box className={styled.postTitle}>{post.title}</Box>
                  </Box>

                  <Box className={styled.postContents}>
                    <Box>{post.contents.substr(0, 100)}</Box>
                  </Box>

                  <Box className={styled.postDescription}>
                    <Box className={styled.postTag} component="ul">
                      {post.Tags?.map((tag: IPostByTags, index: number) => {
                        return (
                          <Link key={index} href={`/post/tag/${tag.tagName}`}>
                            <ListItem className={styled.tagWrap}>
                              <Chip
                                className={styled.tag}
                                variant="outlined"
                                label={"# " + tag.tagName}
                              ></Chip>
                            </ListItem>
                          </Link>
                        );
                      })}
                    </Box>
                    <Box
                      className={`${styled.postDescription} ${styled.postBottomDescription}`}
                    >
                      <Box className={styled.like}>좋아요 {post.like}개 </Box>
                      <Box className={styled.createdAt}>
                        {moment(post.createdAt).utc().fromNow()}
                      </Box>
                    </Box>
                  </Box>
                </Link>
              </Box>
            );
          })}
          <Box ref={lastPostRef}></Box>
        </Box>
      )}
    </Box>
  );
}

export async function getServerSideProps(context: any) {
  const { page } = context.query;

  await apiClient.prefetchQuery(
    "getPostList",
    async () => await frontApi.get(`/page/${page}`)
  );

  return {
    props: {
      dehydrateState: dehydrate(apiClient),
    },
  };
}
