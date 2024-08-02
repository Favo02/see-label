import ImageUploader from "./components/ImageUploader"
import ImagePreview from "./components/ImagePreview"
import React, { useState } from "react";

const API_ENDPOINT = "http://localhost:8000/api/v1/image-data"

function App() {
  const [file, setFile] = useState();

  const sendFile = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file.blob);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log(await response.json())
      } else {
        alert("Error sending file");
      }
    } catch (e) {
      alert("Error sending file");
    }
  };

  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-r from-slate-900 to-sky-950 p-10">
      <h1 className="text-7xl font-black text-white w-full text-center">See Label</h1>

      {!file && (
        <div>
          <h2 className="text-white font-bold text-2xl p-4 mt-10">Upload image:</h2>
          <ImageUploader setFile={setFile} />
        </div>
      )}

      {file && (
        <div>
          <h1 className="text-white">Image uploaded successfully</h1>
          <ImagePreview image={file.url} />

          <button onClick={sendFile} type="button" className="text-white bg-gradient-to-r from-sky-500 via-sky-600 to-sky-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-sky-300 dark:focus:ring-sky-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
            Analyze image: extract objects
          </button>

          <button type="button" className="text-white bg-gradient-to-r from-sky-500 via-sky-600 to-sky-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-sky-300 dark:focus:ring-sky-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
            Import analyzed objects
          </button>

          <button type="button" className="text-white bg-gradient-to-r from-sky-500 via-sky-600 to-sky-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-sky-300 dark:focus:ring-sky-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
            Manually select objects
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
