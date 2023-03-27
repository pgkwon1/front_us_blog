import { Box, Chip, ListItem, Skeleton } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import styled from "../../styles/posts/Posts.module.css";
import { IPostDto } from "../dto/PostDto";
import { apiContext } from "@/context/ApiContext";
import Link from "next/link";

export default function Posts({ posts }) {
  const [postList, setPostList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { frontApi } = useContext(apiContext);
  useEffect(() => {
    frontApi.get("/api").then((result) => {
      if (result.status === 200) {
        setPostList(result.data);
        setLoading(false);
      }
    });
  }, []);

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
                      <Chip label={post.category}></Chip>
                    </Box>
                    <Box className={styled.postTitle}>{post.title}</Box>
                  </Box>

                  <Box className={styled.postContents}>
                    <Box>{post.contents.substr(0, 100)}</Box>
                  </Box>

                  <Box className="postDescription">
                    <Box className={styled.postTag}>
                      {post.postsTags?.map((tag: string, index: number) => {
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
                  </Box>
                </Link>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
