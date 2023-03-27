import { Editor, EditorState, convertFromRaw } from "draft-js";
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
  Separator,
} from "draft-js-buttons";

import "draft-js/dist/Draft.css";
import { useState } from "react";

function MyEditor() {
  const inlineToolbarPlugin = createInlineToolbarPlugin({
    structure: [
      BoldButton,
      ItalicButton,
      UnderlineButton,
      CodeButton,
      Separator,
    ],
  });
  //const toolbarPlugin = createToolbarPlugin();
  const emptyContentState = convertFromRaw({
    entityMap: {},
    blocks: [
      {
        text: "",
        key: "foo",
        type: "unstyled",
        entityRanges: [],
      },
    ],
  });
  const [editorState, setEditorState] = useState(() =>
    EditorState.createWithContent(emptyContentState)
  );

  const onChange = (editorState) => {
    setEditorState(editorState);
  };

  return (
    <Editor
      plugins={[inlineToolbarPlugin]}
      editorState={editorState}
      onChange={onChange}
    />
  );
}
export default MyEditor;
