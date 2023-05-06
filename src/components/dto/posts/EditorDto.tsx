export interface IEditorProps {
  editorRef: RefObject<HTMLDivElement>;
  handleContents: (contents: string) => void;
}
