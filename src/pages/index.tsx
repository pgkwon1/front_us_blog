import Posts from "@/components/blog/posts";
import { Box } from "@mui/material";
import Link from "next/link";

function Index({ apiConfig }: any) {
  return (
    <>
      <Link href={"/post/write"}>
        <Box
          sx={{
            padding: "1rem",
            background: "#fff",
            marginBottom: "1rem",
            borderRadius: "10px",
          }}
        >
          <Box
            sx={{ color: "#857d7d", padding: "1.5rem", background: "#e9e9e9" }}
          >
            오늘 공부한 것을 기록해보세요!
          </Box>
        </Box>
      </Link>
      <Posts />
    </>
  );
}

export default Index;
