import ProjectWriteComponent from "@/components/member/profile/Project/ProjectWrite";
import apiClient from "@/modules/reactQueryInstance";
import axios from "axios";
import { dehydrate } from "react-query";

export default function ProjectWritePage() {
  return (
    <>
      <ProjectWriteComponent edit={false} />
    </>
  );
}
export const getServerSideProps = () => {
  apiClient.prefetchQuery("getAllSkillList", async () => {
    await axios.get("/skills");
  });
  return {
    props: {
      dehydrateState: dehydrate(apiClient),
      isSideBarRender: false,
    },
  };
};
