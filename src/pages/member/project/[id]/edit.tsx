import ProjectWriteComponent from "@/components/member/profile/Project/ProjectWrite";
import { useRouter } from "next/router";

export default function ProjectEdit() {
  const router = useRouter();
  const id = router.query.id as string;

  return <ProjectWriteComponent edit={true} projectId={id} />;
}

export const getServerSideProps = () => {
  return {
    props: {
      isSideBarRender: false,
    },
  };
};
