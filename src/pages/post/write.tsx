import { Box, Button, TextField } from "@mui/material";
import styled from "../../styles/posts/Posts.module.css";
import TextEditor from "@/components/blog/editor";
export default function postWrite() {
  return (
    <Box className={styled.writeWrap}>
      <TextField label="제목" variant="standard" />
      <TextEditor />
    </Box>
  );
}
