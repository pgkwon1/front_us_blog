import { Box, Chip, ListItem, Skeleton } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import BusinessIcon from "@mui/icons-material/Business";
import CodeIcon from "@mui/icons-material/Code";
import CoffeeIcon from "@mui/icons-material/Coffee";
import styled from "../../styles/posts/Posts.module.css";
import { IPostDto } from "../dto/PostDto";
import Link from "next/link";
import frontApi from "@/modules/apiInstance";
import { GetServerSideProps } from "next";
import { dehydrate, useInfiniteQuery } from "react-query";
import apiClient from "@/modules/reactQueryInstance";

export default function Posts({ posts }) {
  const [postList, setPostList] = useState([]);
  const [loading, setLoading] = useState(true);
  const lastPostRef = useRef(null);
  useEffect(() => {}, []);
  const getPostList = async (page: number): Promise<Array<object>> => {
    page = page ?? 1;
    const result = await frontApi.get(`/page/${page}`);
    setPostList((prevList) => prevList.concat(result.data.postList));
    result.status === 200 && setLoading(false);
    return result.data;
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "직장":
        return <BusinessIcon />;
      case "잡담":
        return <CoffeeIcon />;
      case "기술":
        return <CodeIcon />;
    }
  };

  const { data, isSuccess, hasNextPage, fetchNextPage, isStale } =
    useInfiniteQuery(
      "postList",
      ({ pageParam = 1 }) => getPostList(pageParam),
      {
        getNextPageParam: (lastPage, allPages) => {
          const nextPage = allPages.length + 1;
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
      data?.pages.map((page, index) => {
        setPostList((prevList, index) => prevList.concat(page.postList));
      });
      setLoading(false);
    }
  }, []);
  const handleObserver = useCallback(
    (entries) => {
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
      observer.observe(lastElement);
      return () => observer.unobserve(lastElement);
    }
  }, [loading, fetchNextPage, hasNextPage, handleObserver]);

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
                        label={post.category}
                      ></Chip>
                    </Box>
                    <Box className={styled.postTitle}>{post.title}</Box>
                  </Box>

                  <Box className={styled.postContents}>
                    <Box>{post.contents.substr(0, 100)}</Box>
                  </Box>

                  <Box className={styled.postDescription}>
                    <Box className={styled.postTag} component="ul">
                      {post.Tags?.map((tag: string, index: number) => {
                        return (
                          <ListItem className={styled.tagWrap} key={index}>
                            <Chip
                              className={styled.tag}
                              variant="outlined"
                              label={"# " + tag.tagName}
                            ></Chip>
                          </ListItem>
                        );
                      })}
                    </Box>
                    <Box
                      className={[
                        styled.postDescription,
                        styled.postBottomDescription,
                      ]}
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

export async function getServerSideProps(): GetServerSideProps {
  await apiClient.prefetchQuery("getPostList", async () => await getPostList());

  return {
    props: {
      dehydrateState: dehydrate(apiClient),
    },
  };
}
