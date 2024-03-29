import { Box, Chip, ListItem, SvgIconProps, Typography } from "@mui/material";
import styled from "@/styles/posts/Posts.module.css";
import BusinessIcon from "@mui/icons-material/Business";
import CodeIcon from "@mui/icons-material/Code";
import CoffeeIcon from "@mui/icons-material/Coffee";
import PersonIcon from "@mui/icons-material/Person";

import { Category, IPostByTags, IPostList } from "@/dto/PostDto";
import Link from "next/link";
import moment from "moment-timezone";
import { ReactElement, useCallback } from "react";

interface IPostProps {
  post: IPostList;
}

export default function Post({ post }: IPostProps) {
  const getCategoryIcon = useCallback(
    (category: Category): ReactElement<SvgIconProps> => {
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
    },
    []
  );

  return (
    <Box className={styled.post}>
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
          <Typography>
            {post.contents.replace(/<\/?[^>]+(>|$)/g, "").substr(0, 100)}
          </Typography>
        </Box>

        <Box className={styled.postDescription}>
          <Box className={styled.postTag} component="ul">
            {post.Tags?.map((tag: IPostByTags, index: number) => {
              return (
                <Link key={index} href={`/post/tag/${tag.tagName}`}>
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
}
