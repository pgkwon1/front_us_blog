import { Category, IPostByTags, IPostWriteForm } from "@/dto/PostDto";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import PostWrite from "../write";
import frontApi from "@/modules/apiInstance";
import apiClient from "@/modules/reactQueryInstance";
import axios from "axios";
import { dehydrate, useMutation, useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { setEditMode, setEditPostContents } from "@/store/reducers/post";

export default function Edit() {
  const router = useRouter();
  const dispatch = useDispatch();
  const id = router.query.id;
  const [editData, setEditData] = useState({
    title: "",
    Tags: [] as IPostByTags[],
    contents: "",
    category: "" as Category,
  });
  const getQueryKey = useMemo(() => ["getPost", id], [id]);
  const editQueryKey = useMemo(() => ["getPost", id], [id]);

  const getPost = async () => {
    const result = await frontApi.get(`/post/${id}`);
    setEditData(result.data.post);
    dispatch(setEditPostContents(result.data.post.contents));
  };

  const editPost = async (editData: IPostWriteForm) => {
    await frontApi.patch(`/post/edit/${id}`, editData);
  };
  const handleEdit = async (editData: IPostWriteForm) => {
    await editMutation.mutate(editData);
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
  apiClient.prefetchQuery(["getPost", id], async () => {
    await axios.get(`/post/${id}`);
  });
  return {
    props: {
      dehydrateState: dehydrate(apiClient),
    },
  };
}
