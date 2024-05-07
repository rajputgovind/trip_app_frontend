import React, { useEffect, useRef,useState } from "react";

const  Editor=({ name, onChange, editorLoaded,value })=> {
  const editorRef = useRef();
  const { CKEditor, ClassicEditor } = editorRef.current || {};
const [editorData,setEditorData]=useState(false)
  useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor, // v3+
      ClassicEditor: require("@ckeditor/ckeditor5-build-classic"),
    };
    setEditorData(true)
  }, []);

  return (
    <div>
      {editorData ? (
        <CKEditor
          type=""
          name={name}
          editor={ClassicEditor}
          config={{
            ckfinder: {
              // Upload the images to the server using the CKFinder QuickUpload command
              // You have to change this address to your server that has the ckfinder php connector
              uploadUrl: "", //Enter your upload url
            },
          }}
          data={value}
          onChange={(event, editor) => {
            const data = editor.getData();

            onChange(data);
          }}
        />
      ) : (
        <div>Editor loading</div>
      )}
    </div>
  );
}

export default Editor;
