import { setLoginState } from "@/store/actions/user";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
export default function logout() {
  const dispatch = useDispatch();
  const { push } = useRouter();
  useEffect(() => {
    dispatch(setLoginState(0));
    localStorage.removeItem("token");
    push("/");
  }, []);
}
