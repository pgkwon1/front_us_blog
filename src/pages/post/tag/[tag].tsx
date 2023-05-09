import { ReactElement, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { GetServerSidePropsContext } from "next";
import { dehydrate, useInfiniteQuery } from "react-query";
import { useRouter } from "next/router";
import { ThreeDots } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";

import { Box, Chip, ListItem, SvgIconProps } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import CodeIcon from "@mui/icons-material/Code";
import CoffeeIcon from "@mui/icons-material/Coffee";
import PersonIcon from "@mui/icons-material/Person";
import styled from "@/styles/posts/Posts.module.css";

import { Category, IPostByTagPage, IPostDto } from "@/components/dto/PostDto";
import frontApi from "@/modules/apiInstance";
import apiClient from "@/modules/reactQueryInstance";
import { setCurrentTag } from "@/store/reducers/post";
import { IRootState } from "@/components/dto/ReduxDto";

import moment from "moment-timezone";
import Error from "next/error";

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
      // 캐시 데이터가 남아있으면서 태그가 달라졌을 경우 다시 데이터를 가져옴
      if (currentTag !== tag) {
        refetch();
      }
      data?.pages.map((post) => {
        setPostList((prevList: any) => prevList.concat(post.postList));
        setLoading(false);
      });
    }
  }, [isStale, currentTag, data?.pages, refetch, tag]);

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
                      {post.Tags?.map(
                        (tag: { tagName: string }, index: number) => {
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
                        }
                      )}
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
          {length > 9 ? <Box ref={lastPostRef}>Loading..</Box> : ""}
        </Box>
      )}
    </Box>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { tag, page } = context.query;
  apiClient.prefetchQuery(
    "getPostByTag",
    async () => (await frontApi.get(`/post/tag/${tag}/${page}`)).data.post
  );
  return {
    props: {
      dehydrateState: dehydrate(apiClient),
    },
  };
}
