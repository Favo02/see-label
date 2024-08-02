import ImageUploader from "./components/ImageUploader"
import ImagePreview from "./components/ImagePreview"
import ImageDrawer from "./components/ImageDrawer";
import React, { useState } from "react";

const API_ENDPOINT = "http://localhost:8000/api/v1/image-data"
const buttonStyle = "text-white text-lg font-bold bg-sky-700 hover:bg-sky-800 focus:ring-4 focus:ring-sky-300 rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-sky-600 dark:hover:bg-sky-700 focus:outline-none dark:focus:ring-sky-800"

function App() {
  const [file, setFile] = useState();
  const [objects, setObjects] = useState();
  const [newObjects, setNewObjects] = useState();

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
        const data = await response.json()
        setObjects(data)
      } else {
        alert("Error sending file");
      }
    } catch (e) {
      alert("Error sending file");
      console.log(e)
    }
  };

  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-r from-slate-900 to-sky-950 p-10">
      <h1 className="text-7xl font-black text-white w-full text-center">See Label</h1>

      {!file && (
        <div className="mx-auto max-w-[500px]">
          <h2 className="text-white font-bold text-2xl p-4 mt-10 text-center">Upload image:</h2>
          <ImageUploader setFile={setFile} />
        </div>
      )}

      {(file && !objects) && (
        <div>
          <div className="my-10 mx-auto flex flex-row justify-center align-center items-center gap-2">
            <button onClick={sendFile} className={buttonStyle}>Analyze image: extract objects</button>
            <button className={buttonStyle}>Import analyzed objects</button>
            <button onClick={() => setObjects([])} className={buttonStyle}>Manually select objects</button>
          </div>

          <h1 className="text-white">Image uploaded successfully</h1>
          <ImagePreview image={file.url} />
        </div>
      )}


      {(file && objects) && (
        <div>
          <ImageDrawer objects={objects} newObjects={newObjects} onNewObject={setNewObjects} image={file.url} />
        </div>
      )}
    </div>
  );
}

export default App;
