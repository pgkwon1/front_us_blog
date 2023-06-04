import Posts from "@/components/post/posts";
import apiClient from "@/modules/reactQueryInstance";
import { Box } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import { dehydrate } from "react-query";

function Index() {
  return (
    <>
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
