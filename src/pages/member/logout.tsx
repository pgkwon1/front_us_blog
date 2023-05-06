import { setCurrentUserId, setLoginState } from "@/store/reducers/user";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
export default function Logout() {
  const dispatch = useDispatch();
  const { push } = useRouter();
  useEffect(() => {
    dispatch(setLoginState(0));
    dispatch(setCurrentUserId(""));
    localStorage.removeItem("token");
    push("/");
  }, [dispatch, push]);
}
