import { Box, Chip, ListItem, Skeleton } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import BusinessIcon from "@mui/icons-material/Business";
import CodeIcon from "@mui/icons-material/Code";
import CoffeeIcon from "@mui/icons-material/Coffee";
import styled from "@/styles/posts/Posts.module.css";
import { IPostDto } from "../dto/PostDto";
import Link from "next/link";
import frontApi from "@/modules/apiInstance";
import { GetServerSideProps } from "next";
import { dehydrate, useInfiniteQuery } from "react-query";
import apiClient from "@/modules/reactQueryInstance";
import moment from "moment-timezone";
import { useRouter } from "next/router";
import { ThreeDots } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentTag } from "@/store/reducers/post";

export default function PostbyTag() {
  const router = useRouter();
  const [postList, setPostList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [length, setLength] = useState(0);
  const lastPostRef = useRef(null);
  const dispatch = useDispatch();
  const { tag } = router.query;
  const currentTag = useSelector((state) => state.postReducer);

  async function getPostByTag(page) {
    const result = await frontApi.get(`/post/tag/${tag}/${page}`);
    dispatch(setCurrentTag(tag));
    setPostList((prevList) => prevList.concat(result.data.postList));
    setLength(result.data.postList);
    setLoading(false);
    return result.data;
  }

  const {
    isLoading,
    data,
    isSuccess,
    refetch,
    hasNextPage,
    fetchNextPage,
    isStale,
  } = useInfiniteQuery(
    "getPostByTag",
    ({ pageParam = 1 }) => getPostByTag(pageParam),

    {
      getNextPageParam(lastPage, allPages) {
        const nextPage = allPages.length + 1;
        return lastPage.postList.length !== 0 ? nextPage : undefined;
      },
      staleTime: 120 * 1000,
      cacheTime: 120 * 1000,
    }
  );

  const handleObserver = useCallback(
    (entries) => {
      const [target] = entries;

      if (target.isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage]
  );

  useEffect(() => {
    if (isStale === false) {
      // 캐시 데이터가 남아있으면서 태그가 달라졌을 경우 다시 데이터를 가져옴
      if (currentTag !== tag) {
        refetch();
      }
      console.log(currentTag);
      data?.pages.map((post) => {
        setPostList((prevList) => prevList.concat(post.postList));
        setLoading(false);
      });
    }
  }, []);

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
  const getCategoryIcon = (category: string) => {
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
          secondaryColor="#4fa94d"
        />
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
                          <Link href={`/post/tag/${tag.tagName}`} key={index}>
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
          {length > 9 ? <Box ref={lastPostRef}>Loading..</Box> : ""}
        </Box>
      )}
    </Box>
  );
}

export async function getServerSideProps(): GetServerSideProps {
  apiClient.prefetchQuery("getPostByTag", async () => await getPostByTag());
  return {
    props: {
      dehydrateState: dehydrate(apiClient),
    },
  };
}
