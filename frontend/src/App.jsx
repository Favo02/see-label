import ImageUploader from "./components/ImageUploader"
import ImagePreview from "./components/ImagePreview"
import ImageDrawer from "./components/ImageDrawer";
import React, { useState } from "react";

const API_ENDPOINT = "http://localhost:8000/api/v1/image-data"
const buttonStyle = "text-white text-lg font-bold bg-sky-700 hover:bg-sky-800 focus:ring-4 focus:ring-sky-300 rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-sky-600 dark:hover:bg-sky-700 focus:outline-none dark:focus:ring-sky-800"

function App() {
  const [file, setFile] = useState();
  const [size, setSize] = useState();
  const [normalizeSize, setNormalizeSize] = useState(true)
  const [objects, setObjects] = useState();
  const [filtered, setFiltered] = useState()
  const [confidence, setConfidence] = useState(0.5)

  async function sendFile() {
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
        setObjects(data.data)
        setFiltered(data.data)
      } else {
        alert("Error sending file");
      }
    } catch (e) {
      alert("Error sending file");
      console.log(e)
    }
  };

  function reset() {
    setFile(undefined)
    setSize(undefined)
    setObjects(undefined)
  }

  function onNewPolygon(data) {
    const label = prompt("Insert label")
    const newObject = {
      color: "#ff0000",
      confidence: 1,
      object_name: label,
      mask_points: [data[Object.keys(data).find(key => key.startsWith("Polygon"))]]
    }
    setObjects([...objects, newObject])
    setFiltered([...filtered, newObject])
  }

  function updateConfidence(confidence) {
    setFiltered(objects.filter(obj => obj.confidence >= confidence))
    setConfidence(confidence)
  }

  function updateFilters(objectName) {
    if (filtered.find(obj => obj.object_name == objectName)) {
      setFiltered(filtered.filter(obj => obj.object_name != objectName))
    } else {
      setFiltered([...filtered, ...objects.filter(obj => obj.object_name == objectName)])
    }
  }

  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-r from-slate-900 to-sky-950 p-10">
      <h1 className="text-5xl font-black text-white w-full text-center">See Label</h1>

      {!file && (
        <div className="mx-auto max-w-[500px]">
          <h2 className="text-white font-bold text-2xl p-4 mt-10 text-center">Upload image:</h2>
          <ImageUploader setFile={setFile} setSize={setSize} normalizeSize={normalizeSize} />

          <label className="inline-flex items-center cursor-pointer">
            <input type="checkbox" value={normalizeSize} className="sr-only peer" defaultChecked onChange={e => setNormalizeSize(e.target.checked)} />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Normalize Size</span>
          </label>

        </div>
      )}

      {(file && !objects) && (
        <div className="mx-auto">
          <div className="my-10 mx-auto flex flex-row justify-center align-center items-center gap-2">
            <button onClick={sendFile} className={buttonStyle}>Automatically extract objects</button>
            <button onClick={() => { setObjects([]); setFiltered([])} } className={buttonStyle}>Manually select objects</button>
            <button className={buttonStyle}>Import analyzed objects</button>
          </div>
          <ImagePreview image={file.url} />
        </div>
      )}

      {(file && objects) && (
        <div>
          <div className="my-10 mx-auto flex flex-row justify-center align-center items-center gap-2">
            <button onClick={reset} className={buttonStyle}>Reset</button>
            <a href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(filtered))}`} download="objects.json" className={buttonStyle}>Export Objects</a>
          </div>
          <div className="w-full flex flex-row">

            <div className="w-2/3">
              <ImageDrawer objects={filtered} image={file.url} size={size} onNewPolygon={onNewPolygon} />
            </div>

            <div className="w-1/3">

              <h1 className="text-white text-4xl font-bold mb-4 text-center">Filters:</h1>
              <div>
                <div className="text-center">
                  <h2 className="text-white text-2xl font-bold mb-4">Confidence treshold: {confidence}</h2>
                  <input type="range" min={0.25} max={1} value={confidence} step="0.01" onChange={(e) => updateConfidence(e.target.value)} className="text-center w-1/2 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                </div>
              </div>

              <h1 className="text-white text-4xl font-bold mt-6 text-center">Detected objects:</h1>
              <h1 className="text-white italic uppercase mb-4 text-center">Click to hide/show</h1>

              {objects.reduce((uniqueObjects, obj) => {
                if (!uniqueObjects.find(o => o.object_name === obj.object_name)) {
                  uniqueObjects.push(obj);
                }
                return uniqueObjects;
              }, []).map(obj => (
                <h2 key={obj.object_name} onClick={() => updateFilters(obj.object_name)} className={`text-2xl italic text-white text-center ${filtered.find(obj2 => obj2.object_name == obj.object_name) ? "font-bold" : "line-through"}`}>
                  {objects.filter(o => o.object_name === obj.object_name).length}x {obj.object_name.toUpperCase()}
                </h2>
              ))}

            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default App;
