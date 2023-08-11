import Profile from "@/components/member/profile/Profile";
import { IRootState } from "@/dto/ReduxDto";
import { setProfileOwner, setProfileUserId } from "@/store/reducers/profile";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ProfileUserId() {
  const router = useRouter();
  const dispatch = useDispatch();
  const userId = router.query.userId as string;
  const currentUserId = useSelector(
    (state: IRootState) => state.userReducer.userId
  );
  useEffect(() => {
    userId === currentUserId
      ? dispatch(setProfileOwner(true))
      : dispatch(setProfileOwner(false));

    dispatch(setProfileUserId(userId));
  }, []);
  return (
    <>
      <Profile profileOwner={false} />
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
