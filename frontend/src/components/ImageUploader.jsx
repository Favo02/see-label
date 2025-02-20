import React from "react"
import { Buffer } from "buffer/";

function ImageUploader({ setFile, setSize, setObjects, setFiltered, normalizeSize }) {

  // scale down image if too big (and normalizeSize flag on)
  function handleChange(e) {
    const MAX_WIDTH = 1000
    const MAX_HEIGHT = 1000

    const file = e.target.files[0]
    const img = new Image()
    const reader = new FileReader()

    reader.onload = function (e) {
      let width = 0, height = 0;
      if (file.type == "application/json") {
        const text = e.target.result
        const json = JSON.parse(text)
        if (json.image) {
          setObjects(json.objects)
          setFiltered(json.objects)

          let imageFromB64 = Buffer.from(json.image.split(",")[1], 'base64');
          img.src = URL.createObjectURL(
            new Blob([imageFromB64.buffer], { type: 'image/jpeg' } /* (1) */)
          );
        }
      } else {
        img.src = e.target.result
      }

      img.onload = function () {
        width = img.width
        height = img.height

        if (normalizeSize) {
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width
              width = MAX_WIDTH
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height
              height = MAX_HEIGHT
            }
          }
        }
        setSize({ "w": width, "h": height })

        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext("2d")
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(function (blob) {
          setFile({
            url: URL.createObjectURL(blob),
            blob: blob,
          })
        }, file.type)
      }
    }
    if (file.type == "application/json")
      reader.readAsText(file)
    else
      reader.readAsDataURL(file)
  }

  return (
    <div className="flex items-center justify-center w-full">
      <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
          </svg>
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPEG or JSON</p>
        </div>
        <input id="dropzone-file" type="file" className="hidden" onChange={handleChange} />
      </label>
    </div>
  )
}

export default ImageUploader
