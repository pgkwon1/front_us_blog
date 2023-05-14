import {
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  ListItem,
  NativeSelect,
  TextField,
} from "@mui/material";
import styled from "../../styles/posts/Posts.module.css";
import dynamic from "next/dynamic";
import { WithContext as ReactTags } from "react-tag-input";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { IAddTagDto, IPostByTags, IPostWriteForm } from "@/dto/PostDto";
import { useRouter } from "next/router";
import frontApi from "@/modules/apiInstance";
import { IRootState } from "@/dto/ReduxDto";
import ReactQuill from "react-quill";

const TextEditor = dynamic(
  async () => await import("@/components/post/editor"),
  {
    ssr: false,
  }
);

export default function PostWrite() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IPostWriteForm>({
    mode: "onSubmit",
    defaultValues: {
      title: "",
      contents: "",
      tags: [] as IAddTagDto[],
    },
  });
  const author = useSelector((state: IRootState) => state.userReducer.userId);
  const [contentsErr, setContentsErr] = useState(false);
  const [writeData, setWriteData] = useState({
    author,
    title: "",
    tags: [] as IAddTagDto[],
    category: "",
    contents: "",
  });
  const editorRef = useRef<ReactQuill>(null);
  const { push } = useRouter();
  const KeyCodes = {
    comma: 188,
    enter: 13,
  };

  const delimiters = [KeyCodes.comma, KeyCodes.enter];

  const handleContents = (contents: string) => {
    setWriteData({
      ...writeData,
      ["contents"]: contents,
    });
  };
  const addTag = (addTag: { id: string; text: string }) => {
    const { tags } = writeData;
    const findTag = tags.filter(
      (tag: IAddTagDto) => tag.tagName === addTag.text
    );
    if (findTag.length === 0 && tags.length < 5) {
      setWriteData({
        ...writeData,
        ["tags"]: [...tags, { tagName: addTag.text }],
      });
    }
  };
  const deleteTag = (deleteIndex: number) => {
    const tagList = writeData.tags.filter(
      (tag, index: number) => deleteIndex !== index
    );
    setWriteData({
      ...writeData,
      ["tags"]: tagList,
    });
  };
  const handleWriteData = ({
    name,
    value,
  }: {
    name: string;
    value: string | null;
  }) => {
    setWriteData({ ...writeData, [name]: value });
  };

  const onSubmit = async () => {
    const contents = editorRef.current !== null ? editorRef.current.value : "";
    if (contents === "") {
      setContentsErr(true);
      return false;
    }
    const { data } = await frontApi.post("/post/write", writeData);
    push(`/post/${data}`);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} name="postForm">
      <Box className={styled.writeWrap}>
        <FormControl>
          <InputLabel variant="standard" htmlFor="uncontrolled-native">
            카테고리
          </InputLabel>
          <NativeSelect
            inputProps={{
              name: "category",
              id: "uncontrolled-native",
            }}
            {...register("category", {
              required: "카테고리를 선택해주세요",
            })}
            onChange={(e) =>
              handleWriteData({ name: "category", value: e.target.value })
            }
            sx={{ width: "15rem" }}
          >
            <option value={""}>카테고리를 선택해주세요</option>

            <option value={"기술"}>기술</option>
            <option value={"잡담"}>잡담</option>
            <option value={"직장"}>직장</option>
          </NativeSelect>
        </FormControl>
        {errors.category?.message ? (
          <Alert severity="error">{errors.category.message}</Alert>
        ) : (
          ""
        )}
        <TextField
          {...register("title", {
            required: "제목을 입력해주세요",
            minLength: {
              value: 3,
              message: "3글자 이상 입력해주세요.",
            },
          })}
          onChange={(e) =>
            handleWriteData({ name: "title", value: e.target.value })
          }
          label="제목"
          variant="standard"
        />
        {errors.title ? (
          <Alert severity="error">{errors.title?.message}</Alert>
        ) : (
          ""
        )}

        <TextEditor editorRef={editorRef} handleContents={handleContents} />
        {contentsErr ? <Alert severity="error">내용을 입력해주세요</Alert> : ""}
        <Box className={styled.postTag} component="ul">
          {writeData.tags.map((tag: IAddTagDto, index) => {
            return (
              <ListItem className={styled.tagWrap} key={index}>
                <Chip
                  className={styled.tag}
                  variant="outlined"
                  label={`# ${tag.tagName}`}
                  onDelete={() => deleteTag(index)}
                  onMouseDown={(event) => {
                    event.stopPropagation();
                  }}
                ></Chip>
              </ListItem>
            );
          })}
        </Box>
        <ReactTags
          delimiters={delimiters}
          handleAddition={addTag}
          handleDelete={(i) => i}
          inputFieldPosition="bottom"
          autocomplete
          placeholder="#태그입력"
        />
        <Button type="submit" variant="outlined">
          글쓰기
        </Button>
      </Box>
    </form>
  );
}
