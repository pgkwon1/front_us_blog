import styled from "../../styles/posts/Posts.module.css";
import {
  Box,
  Button,
  Chip,
  ListItem,
  Popover,
  Typography,
} from "@mui/material";
import { Avatar } from "@mui/joy";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import BusinessIcon from "@mui/icons-material/Business";
import CodeIcon from "@mui/icons-material/Code";
import CoffeeIcon from "@mui/icons-material/Coffee";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import "highlight.js/styles/vs2015.css";
import hljs from "highlight.js";
import { QueryClient, dehydrate, useMutation, useQuery } from "react-query";
import apiClient from "@/modules/reactQueryInstance";
import frontApi from "@/modules/apiInstance";
import Link from "next/link";
import moment from "moment-timezone";
import Like from "@/components/post/like";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "@/dto/ReduxDto";
import { IPostList, IPostByLikes, IPostByTags, Category } from "@/dto/PostDto";
import axios from "axios";
import Comment from "@/components/post/comment/comment";
import { setCurrentPostId } from "@/store/reducers/post";
import {
  DEFAULT_REACT_QUERY_CACHE_TIME,
  DEFAULT_REACT_QUERY_STALE_TIME,
} from "@/constants/react-query.constants";

export default function PostView() {
  const [post, setPost] = useState<IPostList>({
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
  const [open, setOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<HTMLButtonElement>();
  const [isAuthor, setIsAuthor] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const id = router.query.id as string;
  const { userId } = useSelector((state: IRootState) => state.userReducer);
  const queryKey = useMemo(() => ["getPost", id], [id]);
  hljs.configure({
    languages: ["javascript", "ruby", "python", "rust"],
  });

  const getPost = async (): Promise<IPostList> => {
    const result = await frontApi.get(`/post/${id}`);
    return result.data.post;
  };

  const handleDelete = async (): Promise<void> => {
    await mutate();
  };
  const deletePost = async (): Promise<boolean> => {
    if (isAuthor === false) return false;
    await frontApi.delete(`/post/delete`, {
      data: {
        id,
      },
    });
    return true;
  };
  const { isLoading, data, refetch } = useQuery<IPostList>(queryKey, getPost, {
    staleTime: DEFAULT_REACT_QUERY_STALE_TIME,
    cacheTime: DEFAULT_REACT_QUERY_CACHE_TIME,
  });

  const { mutate, isSuccess } = useMutation(["deletePost", id], deletePost);

  const getCategoryIcon = useMemo(() => {
    // eslint-disable-next-line react/display-name
    return (category: Category) => {
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
    dispatch(setCurrentPostId(id));
    data?.author === userId ? setIsAuthor(true) : setIsAuthor(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  useEffect(() => {
    if (isSuccess === true) {
      apiClient.invalidateQueries("getPostList").then(() => {
        router.push("/");
      });
    }
  }, [isSuccess]);
  return (
    <Box className={styled.postWrap}>
      {post ? (
        <Box>
          <Box className={styled.post}>
            <Box className={styled.postInfo}>
              <Box className={styled.postCategory}>
                <Chip
                  icon={getCategoryIcon(post.category)}
                  label={String(post.category)}
                ></Chip>
                {isAuthor ? (
                  <Box>
                    <Button
                      aria-describedby={id}
                      variant="text"
                      onClick={(e) => {
                        setOpen(true);
                        setMenuAnchor(e.currentTarget);
                      }}
                      color={"inherit"}
                    >
                      <KeyboardArrowDownIcon />
                    </Button>
                    <Popover
                      id={id}
                      anchorEl={menuAnchor}
                      open={open}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}
                      onClose={() => setOpen(false)}
                    >
                      <Box
                        sx={{
                          flexDirection: "column",
                          display: "flex",
                        }}
                      >
                        <Button onClick={handleDelete} color={"inherit"}>
                          삭제
                        </Button>
                      </Box>
                    </Popover>
                  </Box>
                ) : (
                  ""
                )}
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
                  sx={{
                    display: "flex",
                    gap: "0.3rem",
                    flexDirection: "column",
                  }}
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
          <Comment />
        </Box>
      ) : (
        "Post Not Found!"
      )}
    </Box>
  );
}

export async function getServerSideProps(context: any) {
  const { id } = context.query;
  const client = new QueryClient();
  await client.prefetchQuery(["getPost", id], async () => {
    const result = await axios.get(`/post/${id}`);
    return result.data.post;
  });

  return {
    props: {
      dehydratedState: dehydrate(client),
    },
  };
}
