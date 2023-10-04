import Profile from "@/components/member/profile/Profile";
import { IRootState } from "@/dto/ReduxDto";
import apiClient from "@/modules/reactQueryInstance";
import { setProfileOwner, setProfileUserId } from "@/store/reducers/profile";
import axios from "axios";
import { useEffect } from "react";
import { dehydrate, QueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";

export default function ProfileIndex() {
  const userId = useSelector((state: IRootState) => state.userReducer.userId);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setProfileOwner(true));
    dispatch(setProfileUserId(userId));
  }, []);
  return (
    <>
      <Profile profileOwner={true} />
    </>
  );
}

export const getServerSideProps = async () => {
  const client = new QueryClient();
  client.prefetchQuery("getAllSkillsList", async () => {
    const result = await axios.get("/skills");
    return result.data;
  });
  return {
    props: {
      isSideBarRender: false,
      dehydrateState: dehydrate(client),
    },
  };
};
