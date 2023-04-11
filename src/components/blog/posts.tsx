import { Box, Chip, ListItem, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import BusinessIcon from "@mui/icons-material/Business";
import CoffeeIcon from "@mui/icons-material/Code";
import CodeIcon from "@mui/icons-material/Coffee";
import styled from "../../styles/posts/Posts.module.css";
import { IPostDto } from "../dto/PostDto";
import Link from "next/link";
import frontApi from "@/modules/apiInstance";
import { GetServerSideProps } from "next";
import { dehydrate, useQuery } from "react-query";
import apiClient from "@/modules/reactQueryInstance";

export default function Posts({ posts }) {
  const [postList, setPostList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {}, []);
  const getPostList = async (): Promise<boolean> => {
    const result = await frontApi.get("/");
    return result.data;
  };

  const { isLoading, data } = useQuery("getPostList", getPostList, {
    staleTime: 10 * 1000,
  });

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

  useEffect(() => {
    !isLoading && setPostList(data);
    setLoading(isLoading);
  }, [isLoading, data]);

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

                  <Box className="postDescription">
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

export async function getServerSideProps(): GetServerSideProps {
  await apiClient.prefetchQuery("getPostList", async () => await getPostList());

  return {
    props: {
      dehydrateState: dehydrate(apiClient),
    },
  };
}
