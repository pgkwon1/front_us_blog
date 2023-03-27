import { apiContext } from "@/context/ApiContext";
import styled from "../../styles/posts/Posts.module.css";
import { Box, Chip, ListItem, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import BusinessIcon from "@mui/icons-material/Business";
export default function postView() {
  const { frontApi } = useContext(apiContext);
  const [post, setPost] = useState({});
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!router.isReady) return;
    frontApi.get(`/api/post/${id}`).then((result) => {
      if (!result.data.post) {
        setPost(false);
      } else {
        setPost(result.data.post);
      }
    });
  }, [router.isReady]);

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
            <Typography>{post.contents}</Typography>
          </Box>

          <Box className="postDescription">
            <Box className={styled.postTag}>
              {post.postsTags?.map((tag: string, index: number) => {
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
