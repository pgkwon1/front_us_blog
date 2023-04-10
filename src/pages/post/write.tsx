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
import { useContext, useRef, useEffect, useState } from "react";
import { apiContext } from "@/context/ApiContext";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { IPostWriteForm } from "@/components/dto/PostDto";
import { useRouter } from "next/router";
const TextEditor = dynamic(
  async () => await import("@/components/blog/editor"),
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
      tags: [],
    },
  });
  const author = useSelector((state) => state.userReducer.userId);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [category, setCategory] = useState("");
  const [contentsErr, setContentsErr] = useState(false);
  const editorRef = useRef(null);
  const { frontApi } = useContext(apiContext);
  const { push } = useRouter();
  const KeyCodes = {
    comma: 188,
    enter: 13,
  };

  const delimiters = [KeyCodes.comma, KeyCodes.enter];

  const addTag = (addTag) => {
    const findTag = tags.filter((tag) => tag.tagName === addTag.text);
    if (findTag.length === 0 && tags.length < 5) {
      setTags([...tags, { tagName: addTag.text }]);
    }
  };
  const deleteTag = (deleteIndex) => {
    setTags(tags.filter((tag, index) => deleteIndex !== index));
  };

  const changeCategory = (event) => {
    console.log(event.target.value);
    setCategory(event.target.value);
  };
  const onSubmit = async () => {
    const contents = editorRef?.current.value;

    if (contents === "") {
      setContentsErr(true);
      return false;
    }
    const { data } = await frontApi.post("/post/write", {
      author,
      title,
      contents,
      tags,
      category,
    });
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
            onChange={changeCategory}
            sx={{ width: "15rem" }}
          >
            <option value={""}>카테고리를 선택해주세요</option>

            <option value={"기술"}>기술</option>
            <option value={"잡담"}>잡담</option>
            <option value={"직장"}>직장</option>
          </NativeSelect>
        </FormControl>
        <TextField
          {...register("title", {
            required: "제목을 입력해주세요",
            minLength: {
              value: 3,
              message: "3글자 이상 입력해주세요.",
            },
          })}
          onChange={(event) => setTitle(event.target.value)}
          label="제목"
          variant="standard"
        />
        {errors.title ? (
          <Alert severity="error">{errors.title?.message}</Alert>
        ) : (
          ""
        )}

        <TextEditor editorRef={editorRef} />
        {contentsErr ? <Alert severity="error">내용을 입력해주세요</Alert> : ""}
        <Box className={styled.postTag} component="ul">
          {tags.map((tag, index) => {
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
