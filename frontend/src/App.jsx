import ImageUploader from "./components/ImageUploader"
import React, { useState } from "react";

function App() {

  const [file, setFile] = useState();

  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-r from-slate-900 to-sky-950 p-10">

      <h1 className="text-7xl font-black text-white w-full text-center">See Label</h1>

      {/* no image: uploader */}
      {!file && <ImageUploader file={file} setFile={setFile} />}

      {/* image */}
      {file &&
        <div>
          <h1 className="text-white">Image uploaded successfully</h1>


        </div>
      }

    </div>
  );
}

export default App;
