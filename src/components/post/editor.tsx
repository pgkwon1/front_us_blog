import { Box } from "@mui/material";
import { forwardRef, useEffect, useMemo, useState } from "react";
import hljs from "highlight.js";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "highlight.js";
import "highlight.js/styles/vs2015.css";
import { useDispatch } from "react-redux";
// eslint-disable-next-line react/display-name
const Editor = forwardRef(({ editorRef, handleContents }) => {
  const [value, setValue] = useState("");
  const dispatch = useDispatch();
  hljs.configure({
    languages: ["javascript", "ruby", "python", "rust"],
  });

  const changeContents = (contents) => {
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

  let timeout = null;
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
          changeContents(editor.getHTML());
          setValue(editor.getHTML());
        }}
      />
    </Box>
  );
});
export default Editor;
