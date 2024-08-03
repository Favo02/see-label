import ImageUploader from "./components/ImageUploader"
import ImagePreview from "./components/ImagePreview"
import ImageDrawer from "./components/ImageDrawer"
import JsonUploader from "./components/JsonUploader"
import React, { useState } from "react"
import noIntersections from "shamos-hoey";

const API_ENDPOINT = "/api/v1/image-data"
const MANUAL_COLORS = ["#fcba03", "#32a852", "#eb4034", "#4287f5", "#7442c9", "#38a676", "#bf6215"];

function App() {
  const [image, setImage] = useState() // image to elaborate (uploaded by user)
  const [imageSize, setImageSize] = useState() // height and width of the image
  const [normalizeSize, setNormalizeSize] = useState(true) // if preferred to downscale the image

  const [objects, setObjects] = useState() // objects detected in image
  const [refresh, setRefresh] = useState(false) // property to force a refresh of the canvas
  const [filtered, setFiltered] = useState() // objects currently active (with filters)
  const [confidence, setConfidence] = useState(0.5) // confidence interval (a filter)

  const [loading, setLoading] = useState(false) // something is loading (an API call probabily)

  function reset() {
    setImage(undefined)
    setImageSize(undefined)
    setObjects(undefined)
  }

  async function apiCall() {
    if (!image) return

    const formData = new FormData()
    formData.append("file", image.blob)

    try {
      setLoading(true)
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setObjects(data.data)
        setFiltered(data.data)
      } else {
        alert("Error sending file")
      }
    } catch (e) {
      alert("Error sending file")
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  function importObjects(e) {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8")
    fileReader.onload = e => {
      const objectsJson = JSON.parse(e.target.result)
      setObjects(objectsJson.objects)
      setFiltered(objectsJson.objects)
    }
  }

  function checkValidPolygon(points) {
    const box = {type: 'Polygon', coordinates: [points]}
    return noIntersections(box)
  }

  function newDrawnPolygon(data) {
    const points = data[Object.keys(data).find(key => key.startsWith("Polygon"))];
    if(!points || points.length < 3 || !checkValidPolygon(points)){
      alert("The polygon is not valid");
      const testObject = {
          color: "#ff0000",
          confidence: 1,
          object_name: "__INVALIDPOLYGON__",
          mask_points: []
      };
      setRefresh(!refresh);
      return;
    }
    const label = prompt("Insert label").toLowerCase();
    let polygonColor= MANUAL_COLORS[Math.floor(Math.random() * MANUAL_COLORS.length)];
    for (const object of objects){
        if (object.object_name === label){
            polygonColor = object.color;
            break;
        }
    }
    const newObject = {
      color: polygonColor,
      confidence: 1,
      object_name: label,
      mask_points: points
    }
    setObjects([...objects, newObject])
    setFiltered([...filtered, newObject])
  }

  function updateConfidence(confidence) {
    setFiltered(objects.filter(obj => obj.confidence >= confidence))
    setConfidence(confidence)
  }

  function updateFilters(objectName) {
    if (filtered.find(obj => obj.object_name === objectName)) {
      setFiltered(filtered.filter(obj => obj.object_name !== objectName))
    } else {
      setFiltered([...filtered, ...objects.filter(obj => obj.object_name === objectName)])
    }
  }

  async function exportImageObjects(withImage) {

    function blobToBase64(blob) {
      return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    }

    let obj
    if (withImage) {
      const base64 = await blobToBase64(image.blob)
      obj = { "image": base64, "objects": filtered }
    } else {
      obj = { "objects": filtered }
    }
    const json = JSON.stringify(obj) + "\n"

    const a = document.createElement("a")
    a.href = `data:text/json;charset=utf-8,${encodeURIComponent(json)}`
    a.download = withImage ? "image-objects.json" : "objects.json"
    a.click()
  }

  if (!image) {
    return (
      <div className="mx-auto max-w-[500px]">
        <h1 className="text-white text-3xl font-bold text-center pt-6 pb-4">To get started, please upload an image</h1>

        <ImageUploader setFile={setImage} setSize={setImageSize} normalizeSize={normalizeSize} />

       


        <h1 className="text-white text-md font-bold italic text-center py-4">NOTE: You will be able to import objects later</h1>

        <div className="flex justify-center items-center">
          <label className="inline-flex items-center justify-center cursor-pointer w-full">
            <input type="checkbox" value={normalizeSize} className="sr-only peer" defaultChecked onChange={e => setNormalizeSize(e.target.checked)} />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 dark:peer-focus:ring-sky-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-sky-600" />
            <span className="ms-3 text-lg font-bold text-white dark:text-gray-300">Normalize image size</span>
          </label>
        </div>
        <JsonUploader setFile={setImage} setSize={setImageSize} />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="mx-auto">

        <h1 className="text-white text-3xl font-bold text-center pt-6 pb-4">Loading...</h1>

        <div className="mx-auto flex flex-row justify-center align-center items-center gap-2">
          <button disabled onClick={apiCall} className="text-white text-lg font-bold bg-gray-700 hover:bg-gray-700 rounded-lg text-sm px-5 py-2.5">Automatically extract objects</button>
          <button disabled onClick={() => { setObjects([]); setFiltered([])} } className="text-white text-lg font-bold bg-gray-700 hover:bg-gray-700 rounded-lg text-sm px-5 py-2.5">Manually select objects</button>
          <button disabled className="text-white text-lg font-bold bg-gray-700 hover:bg-gray-700 rounded-lg text-sm px-5 py-2.5">Import analyzed objects</button>
          <button disabled onClick={reset} className="text-white text-lg font-bold bg-gray-700 hover:bg-gray-700 rounded-lg text-sm px-5 py-2.5">Reset</button>
        </div>
        <ImagePreview image={image.url} />
      </div>
    )
  }

  if (!objects) {
    return (
      <div className="mx-auto">

        <h1 className="text-white text-3xl font-bold text-center pt-6 pb-4">Available actions</h1>

        <div className="mx-auto flex flex-row justify-center align-center items-center gap-2">
          <button onClick={apiCall} className="text-white text-lg font-bold bg-sky-700 hover:bg-sky-800 rounded-lg text-sm px-5 py-2.5">Automatically extract objects</button>

          <button onClick={() => { setObjects([]); setFiltered([])} } className="text-white text-lg font-bold bg-sky-700 hover:bg-sky-800 rounded-lg text-sm px-5 py-2.5">Manually select objects</button>

          <div className="text-white text-lg font-bold bg-sky-700 hover:bg-sky-800 rounded-lg text-sm px-5 py-2.5">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Import analyzed objects</label>
            <input id="file_input" type="file" onChange={importObjects}
                aria-describedby="file_input_help" className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" />
          </div>

          <button onClick={reset} className="text-white text-lg font-bold bg-red-700 hover:bg-red-800 rounded-lg text-sm px-5 py-2.5">Reset</button>
        </div>
        <ImagePreview image={image.url} />
      </div>
    )
  }

  return (
    <div>

      <h1 className="text-white text-3xl font-bold text-center pt-6 pb-4">Click on the image to manually add polygons or Apply some filters</h1>

      <div className="mx-auto flex flex-row justify-center align-center items-center gap-2">

        <button onClick={() => exportImageObjects(false)} className="text-white text-lg font-bold bg-sky-700 hover:bg-sky-800 rounded-lg text-sm px-5 py-2.5">Export Objects only (JSON)</button>

        <button onClick={() => exportImageObjects(true)} className="text-white text-lg font-bold bg-sky-700 hover:bg-sky-800 rounded-lg text-sm px-5 py-2.5">Export Image + Objects (JSON)</button>

        <button onClick={reset} className="text-white text-lg font-bold bg-red-700 hover:bg-red-800 rounded-lg text-sm px-5 py-2.5">Reset</button>
      </div>
      <h1 className="text-white text-md font-bold italic text-center pt-2">NOTE: Only objects NOT filtered out will be exported</h1>

      <div className="w-full flex flex-row mt-4">

        <div className="w-2/3">
          <ImageDrawer refresh={refresh} objects={filtered} image={image.url} size={imageSize} onNewPolygon={newDrawnPolygon} />
        </div>

        <div className="w-1/3">

          <h1 className="text-white text-4xl font-bold mb-4 text-center">Filters:</h1>
          <div>
            <div className="text-center">
              <h2 className="text-white text-2xl font-bold mb-4">Confidence treshold: {confidence}</h2>
              <input type="range" min={0.25} max={1} value={confidence} step="0.01" onChange={(e) => updateConfidence(e.target.value)} className="w-full max-w-[200px] h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
            </div>
          </div>

          <h1 className="text-white text-4xl font-bold mt-6 text-center">Detected objects:</h1>
          <h1 className="text-white italic uppercase mb-4 text-center">Click to hide/show</h1>

          {objects.reduce((uniqueObjects, obj) => {
            if (!uniqueObjects.find(o => o.object_name === obj.object_name)) {
              uniqueObjects.push(obj)
            }
            return uniqueObjects
          }, []).map(obj => (
            <h2 key={obj.object_name} onClick={() => updateFilters(obj.object_name)} className={`cursor-pointer text-2xl italic text-white text-center ${filtered.find(obj2 => obj2.object_name === obj.object_name) ? "" : "line-through"}`}>
              {objects.filter(o => o.object_name === obj.object_name).length}x {obj.object_name.toUpperCase()}
            </h2>
          ))}

        </div>

      </div>
    </div>
  )
}

export default App
