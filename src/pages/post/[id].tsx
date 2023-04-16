import styled from "../../styles/posts/Posts.module.css";
import { Box, Chip, ListItem, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import BusinessIcon from "@mui/icons-material/Business";
import CodeIcon from "@mui/icons-material/Code";
import CoffeeIcon from "@mui/icons-material/Coffee";

import "highlight.js/styles/vs2015.css";
import hljs from "highlight.js";
import { dehydrate, useQuery } from "react-query";
import { GetServerSideProps } from "next";
import apiClient from "@/modules/reactQueryInstance";
import frontApi from "@/modules/apiInstance";
import Link from "next/link";
import moment from "moment-timezone";

export default function PostView() {
  const [post, setPost] = useState({});
  const router = useRouter();
  const { id } = router.query;
  hljs.configure({
    languages: ["javascript", "ruby", "python", "rust"],
  });

  const getPost = async (): Promise<object> => {
    const result = await frontApi.get(`/post/${id}`);
    return result;
  };

  const { isLoading, data, isStale, refetch } = useQuery("getPost", getPost, {
    staleTime: 10 * 1000,
    cacheTime: 10 * 1000,
  });

  if (isStale === false && data.data.post.id !== id) {
    refetch();
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case "직장":
        return <BusinessIcon />;
      case "기술":
        return <CodeIcon />;
      case "잡담":
        return <CoffeeIcon />;
    }
  };
  useEffect(() => {
    !isLoading && setPost(data.data.post);
  }, [isLoading, data]);

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
            <Box className={styled.postTitle}>{post.title}</Box>
          </Box>

          <Box className={styled.postContents}>
            <Typography
              dangerouslySetInnerHTML={{ __html: post.contents }}
            ></Typography>
          </Box>

          <Box className={styled.postDescription}>
            <Box className={styled.postTag} component="ul">
              {post.Tags?.map((tag: string, index: number) => {
                return (
                  <ListItem className={styled.tagWrap} key={index}>
                    <Link href={`/post/tag/${tag.tagName}`}>
                      <Chip
                        className={styled.tag}
                        variant="outlined"
                        label={`# ${tag.tagName}`}
                      ></Chip>
                    </Link>
                  </ListItem>
                );
              })}
            </Box>
          </Box>
          <Box
            className={[styled.postDescription, styled.postBottomDescription]}
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

export async function getServerSideProps(): GetServerSideProps {
  await apiClient.prefetchQuery(["getPost"], async () => await getPost());

  return {
    props: {
      dehydratedState: dehydrate(apiClient),
    },
  };
}
