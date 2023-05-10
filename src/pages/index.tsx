import Posts from "@/components/post/posts";
import frontApi from "@/modules/apiInstance";
import apiClient from "@/modules/reactQueryInstance";
import { Box } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import { dehydrate } from "react-query";

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
export async function getServerSideProps(context: any) {
  const { page } = context.query;

  await apiClient.prefetchQuery("getPostList", async () => {
    const result = await axios.get(`/page/${page}`);
    return result.data.postList;
  });

  return {
    props: {
      dehydrateState: dehydrate(apiClient),
    },
  };
}
export default Index;
