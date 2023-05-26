import styled from "../../styles/posts/Posts.module.css";
import {
  Box,
  Button,
  Chip,
  ListItem,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { Avatar } from "@mui/joy";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import BusinessIcon from "@mui/icons-material/Business";
import CodeIcon from "@mui/icons-material/Code";
import CoffeeIcon from "@mui/icons-material/Coffee";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import "highlight.js/styles/vs2015.css";
import hljs from "highlight.js";
import { dehydrate, useQuery } from "react-query";
import apiClient from "@/modules/reactQueryInstance";
import frontApi from "@/modules/apiInstance";
import Link from "next/link";
import moment from "moment-timezone";
import Like from "@/components/post/like";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "@/dto/ReduxDto";
import { IPostList, IPostByLikes, IPostByTags } from "@/dto/PostDto";
import axios from "axios";
import Comment from "@/components/post/comment/comment";
import { setCurrentPostId } from "@/store/reducers/post";

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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

  const { isLoading, data, refetch } = useQuery<IPostList>(queryKey, getPost, {
    staleTime: 10 * 1000,
    cacheTime: 10 * 1000,
  });

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
    dispatch(setCurrentPostId(id));
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
  return (
    <Box className={styled.postWrap}>
      {post ? (
        <Box>
          <Box className={styled.post}>
            <Box className={styled.postInfo}>
              <Box className={styled.postCategory}>
                <Chip
                  icon={getCategoryIcon(String(post.category))}
                  label={String(post.category)}
                ></Chip>
                <Box className={styled.expandMenu}>
                  <Button>
                    <ExpandMoreIcon
                      onClick={() => setMenuOpen(true)}
                      fontSize="large"
                      aria-controls={
                        menuOpen ? "demo-positioned-menu" : undefined
                      }
                      aria-haspopup="true"
                      aria-expanded={menuOpen ? "true" : undefined}
                    />
                  </Button>
                  <Menu
                    id="demo-positioned-menu"
                    aria-labelledby="demo-positioned-button"
                    open={menuOpen}
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      horizontal: "left",
                    }}
                    onClose={(e) => setMenuOpen(false)}
                  >
                    <MenuItem onClick={() => setMenuOpen(true)}>
                      Profile
                    </MenuItem>
                    <MenuItem onClick={() => setMenuOpen(true)}>
                      Profile
                    </MenuItem>
                    <MenuItem onClick={() => setMenuOpen(true)}>
                      Profile
                    </MenuItem>
                  </Menu>
                </Box>
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
  await apiClient.prefetchQuery(["getPost", id], async () => {
    const result = await axios.get(`/post/${id}`);
    return result.data.post;
  });

  return {
    props: {
      dehydratedState: dehydrate(apiClient),
    },
  };
}
