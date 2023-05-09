import styled from "../../styles/posts/Posts.module.css";
import { Box, Chip, ListItem, Typography } from "@mui/material";
import { Avatar } from "@mui/joy";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import BusinessIcon from "@mui/icons-material/Business";
import CodeIcon from "@mui/icons-material/Code";
import CoffeeIcon from "@mui/icons-material/Coffee";

import "highlight.js/styles/vs2015.css";
import hljs from "highlight.js";
import { dehydrate, useQuery } from "react-query";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import apiClient from "@/modules/reactQueryInstance";
import frontApi from "@/modules/apiInstance";
import Link from "next/link";
import moment from "moment-timezone";
import Like from "@/components/post/like";
import { useSelector } from "react-redux";
import { IRootState } from "@/components/dto/ReduxDto";
import {
  Category,
  IPostByIdPage,
  IPostByLikes,
  IPostByTags,
} from "@/components/dto/PostDto";

export default function PostView() {
  const [post, setPost] = useState<IPostByIdPage>({
    id: "",
    author: "",
    Tags: [],
    postsLikes: [],
    category: "기술",
    title: "",
    contents: "",
    like: 0,
    unlike: 0,
    createdAt: new Date(),
  });
  const [likeInfo, setLikeInfo] = useState({
    like: false,
    unlike: false,
  });

  const router = useRouter();
  const { id } = router.query;
  const { userId } = useSelector((state: IRootState) => state.userReducer);
  hljs.configure({
    languages: ["javascript", "ruby", "python", "rust"],
  });

  const getPost = async (): Promise<IPostByIdPage> => {
    const result = await frontApi.get(`/post/${id}`);
    return result.data.post;
  };

  const { isLoading, data, isStale, refetch } = useQuery<IPostByIdPage>(
    "getPost",
    getPost,
    {
      staleTime: 10 * 1000,
      cacheTime: 10 * 1000,
    }
  );

  if (isStale === false && data?.id !== id) {
    refetch();
  }

  const getCategoryIcon = useMemo(() => {
    // eslint-disable-next-line react/display-name
    return (category: string) => {
      switch (category) {
        case "직장":
          return <BusinessIcon />;
        case "기술":
          return <CodeIcon />;
        case "잡담":
          return <CoffeeIcon />;
      }
    };
  }, []);
  useEffect(() => {
    data && setPost(data);
  }, [isLoading, data]);

  useEffect(() => {
    post.postsLikes?.map((like: IPostByLikes) => {
      if (like.type === "LIKE" && like.userId === userId) {
        setLikeInfo((current) => {
          return {
            ...current,
            like: true,
          };
        });
      } else if (like.type === "UNLIKE" && like.userId === userId) {
        setLikeInfo((current) => {
          return {
            ...current,
            unlike: true,
          };
        });
      }
    });
  }, [post, refetch, userId]);
  return (
    <Box className={styled.postWrap}>
      {post ? (
        <Box className={styled.post}>
          <Box className={styled.postInfo}>
            <Box className={styled.postCategory}>
              <Chip
                icon={getCategoryIcon(post.category)}
                label={post.category}
              ></Chip>
            </Box>
            <Box
              sx={{
                fontSize: "13px",
                display: "flex",
                flexDirection: "row",
                gap: "0.8rem",
              }}
            >
              <Avatar color="primary" variant="soft">
                {post.author && post.author.slice(0, 2).toUpperCase()}
              </Avatar>
              <Box
                sx={{ display: "flex", gap: "0.3rem", flexDirection: "column" }}
              >
                <Box>{post.author}</Box>
                <Box>{moment(post.createdAt).utc().fromNow()}</Box>
              </Box>
            </Box>
            <Box className={styled.postTitle}>{post.title}</Box>
          </Box>

          <Box className={styled.postContents}>
            <Typography
              dangerouslySetInnerHTML={{ __html: post.contents }}
            ></Typography>
          </Box>

          <Box className={styled.postDescription}>
            <Box className={styled.postTag} component="ul">
              {post.Tags?.map((tag: IPostByTags, index: number) => {
                return (
                  <Link href={`/post/tag/${tag.tagName}`} key={index}>
                    <ListItem className={styled.tagWrap}>
                      <Chip
                        className={styled.tag}
                        variant="outlined"
                        label={`# ${tag.tagName}`}
                      ></Chip>
                    </ListItem>
                  </Link>
                );
              })}
            </Box>
          </Box>
          <Like likes={post.like} unlikes={post.unlike} likeProp={likeInfo} />
          <Box
            className={`${styled.postDescription} ${styled.postBottomDescription}`}
          >
            <Box className={styled.like}>좋아요 {post.like}개 </Box>
            <Box className={styled.createdAt}>
              {moment(post.createdAt).utc().fromNow()}
            </Box>
          </Box>
        </Box>
      ) : (
        "Post Not Found!"
      )}
    </Box>
  );
}

export async function getServerSideProps(context: any) {
  const { id } = context.query;
  await apiClient.prefetchQuery("getPost", async () => {
    const result = await frontApi.get(`/post/${id}`);
    return result.data.post;
  });

  return {
    props: {
      dehydratedState: dehydrate(apiClient),
    },
  };
}
