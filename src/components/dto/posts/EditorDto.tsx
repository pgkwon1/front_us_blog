import { RefObject } from "react";
import ReactQuill from "react-quill";

export interface IEditorProps {
  editorRef: RefObject<ReactQuill>;
  handleContents: (contents: string) => void;
}
