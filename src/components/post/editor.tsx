import { Box } from "@mui/material";
import { forwardRef, useState, useMemo } from "react";
import hljs from "highlight.js";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "highlight.js";
import "highlight.js/styles/vs2015.css";
import { useSelector } from "react-redux";
import { IEditorProps } from "@/dto/posts/EditorDto";
import { IRootState } from "@/dto/ReduxDto";

const Editor = forwardRef(function Editor({
  editorRef,
  handleContents,
}: IEditorProps) {
  const editPostContents = useSelector(
    (state: IRootState) => state.postReducer.editPostContents
  );
  const editMode = useSelector(
    (state: IRootState) => state.postReducer.editMode
  );
  const [value, setValue] = useState(editMode ? editPostContents : "");

  hljs.configure({
    languages: ["javascript", "ruby", "python", "rust"],
  });

  const changeContents = (contents: string) => {
    handleContents(contents);
  };
  const modules = useMemo(() => {
    return {
      syntax: {
        highlight: (text: string) => hljs.highlightAuto(text).value,
      },
      toolbar: [
        //[{ 'font': [] }],
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        ["link", "image", "code-block"],
        [{ align: [] }, { color: [] }, { background: [] }],
        ["clean"],
      ],
    };
  }, []);

  const formats = [
    //'font',
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "code-block",
    "align",
    "color",
    "background",
  ];

  return (
    <Box>
      <ReactQuill
        style={{
          height: "300px",
        }}
        ref={editorRef}
        theme="snow"
        modules={modules}
        value={value}
        formats={formats}
        onChange={(_content, _delta, _source, editor) => {
          const contents: string = editor.getHTML();
          changeContents(contents);
          setValue(editor.getHTML());
        }}
      />
    </Box>
  );
});
Editor.displayName = "Editor";

export default Editor;
