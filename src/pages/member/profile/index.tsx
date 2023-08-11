import Profile from "@/components/member/profile/Profile";
import { IRootState } from "@/dto/ReduxDto";
import { setProfileOwner, setProfileUserId } from "@/store/reducers/profile";
import { useEffect } from "react";
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
  return {
    props: {
      isSideBarRender: false,
    },
  };
};
