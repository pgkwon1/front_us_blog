import { apiContext } from "@/context/ApiContext";
import styled from "../../styles/posts/Posts.module.css";
import { Box, Chip, ListItem, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import BusinessIcon from "@mui/icons-material/Business";
import "highlight.js/styles/vs2015.css";
import hljs from "highlight.js";
import { QueryClient, dehydrate, useQuery } from "react-query";
import { GetServerSideProps } from "next";
import apiClient from "@/modules/reactQueryInstance";
import frontApi from "@/modules/apiInstance";

export default function postView() {
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

  const { isLoading, data } = useQuery("getPost", getPost, {
    staleTime: 10 * 1000,
  });

  useEffect(() => {
    !isLoading && setPost(data.data.post);
  }, [isLoading, data]);

  return (
    <Box className={styled.postWrap}>
      {post ? (
        <Box className={styled.post}>
          <Box className={styled.postInfo}>
            <Box className={styled.postCategory}>
              <Chip icon={<BusinessIcon />} label={post.category}></Chip>
            </Box>
            <Box className={styled.postTitle}>{post.title}</Box>
          </Box>

          <Box className={styled.postContents}>
            <Typography
              dangerouslySetInnerHTML={{ __html: post.contents }}
            ></Typography>
          </Box>

          <Box className="postDescription">
            <Box className={styled.postTag} component="ul">
              {post.Tags?.map((tag: string, index: number) => {
                return (
                  <ListItem className={styled.tagWrap} key={index}>
                    <Chip
                      className={styled.tag}
                      variant="outlined"
                      label={`# ${tag.tagName}`}
                    ></Chip>
                  </ListItem>
                );
              })}
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
