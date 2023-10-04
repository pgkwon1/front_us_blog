import { Category, IPostByTags, IPostWriteForm } from "@/dto/PostDto";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import PostWrite from "../write";
import frontApi from "@/modules/apiInstance";
import apiClient from "@/modules/reactQueryInstance";
import axios from "axios";
import { dehydrate, useMutation, useQuery, QueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { setEditMode, setEditPostContents } from "@/store/reducers/post";
import { IRootState } from "@/dto/ReduxDto";

export default function Edit() {
  const router = useRouter();
  const dispatch = useDispatch();
  const id = router.query.id;
  const [editData, setEditData] = useState({
    id: "",
    title: "",
    Tags: [] as IPostByTags[],
    contents: "",
    category: "" as Category,
  });
  const getQueryKey = useMemo(() => ["getPost", id], [id]);
  const editQueryKey = useMemo(() => ["getPost", id], [id]);
  const userId = useSelector((state: IRootState) => state.userReducer.userId);

  const getPost = async () => {
    const result = await frontApi.get(`/post/${id}`);
    if (result.data.post.author !== userId) router.push("/");
    setEditData(result.data.post);
    dispatch(setEditPostContents(result.data.post.contents));
  };

  const editPost = async (editData: IPostWriteForm) => {
    await frontApi.patch(`/post/edit`, editData);
  };
  const handleEdit = async (editData: IPostWriteForm) => {
    await editMutation.mutate(editData, {
      onSettled(data, error, variables, context) {
        apiClient.setQueryData(["getPost", id], variables);
        router.push(`/post/${id}`);
      },
    });
  };
  const editMutation = useMutation(editQueryKey, editPost);
  useQuery(getQueryKey, getPost);

  useEffect(() => {
    dispatch(setEditMode(true));
    return () => {
      dispatch(setEditMode(false));
    };
  }, []);
  return (
    <Box>
      <PostWrite editData={editData} handleEdit={handleEdit} isEdit={true} />
    </Box>
  );
}

export async function getServerSideProps(context: any) {
  const { id } = context.query;
  const client = new QueryClient();
  client.prefetchQuery(["getPost", id], async () => {
    const result = await axios.get(`/post/${id}`);
    return result.data.post;
  });
  return {
    props: {
      dehydrateState: dehydrate(client),
    },
  };
}
