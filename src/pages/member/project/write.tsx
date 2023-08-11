import ProjectWriteComponent from "@/components/member/profile/Project/ProjectWrite";

export default function ProjectWritePage() {
  return (
    <>
      <ProjectWriteComponent edit={false} />
    </>
  );
}
export const getServerSideProps = () => {
  return {
    props: {
      isSideBarRender: false,
    },
  };
};
