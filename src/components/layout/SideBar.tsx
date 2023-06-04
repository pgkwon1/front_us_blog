import { Box, Button, Chip, Typography } from "@mui/material";
import styled from "@/styles/Global.module.css";
import Link from "next/link";
import BusinessIcon from "@mui/icons-material/Business";
import CodeIcon from "@mui/icons-material/Code";
import CoffeeIcon from "@mui/icons-material/Coffee";

export default function SideBar() {
  return (
    <Box className={styled.sidebarWrap}>
      <Link href="/post/write">
        <Button variant="outlined">글쓰기</Button>
      </Link>

      <Box className={styled.sidebar}>
        <Box className={styled.sideberMenuWrap}>
          <Link href="/">
            <Box>전체</Box>
          </Link>
          <Link href="/post/category/기술">
            <Box>
              기술 <CodeIcon />
            </Box>
          </Link>
          <Link href="/post/category/직장">
            <Box>
              직장 <BusinessIcon />{" "}
            </Box>
          </Link>
          <Link href="/post/category/잡담">
            <Box>
              잡담 <CoffeeIcon />
            </Box>
          </Link>
        </Box>
        <Box>
          <Typography>인기 많은 태그</Typography>
          <Box sx={{ border: "1px solid black", padding: "2rem" }}></Box>
          <Chip label={"# React"}></Chip>
        </Box>
      </Box>
    </Box>
  );
}
