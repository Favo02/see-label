import { useEffect, useState } from "react";
import Canvas from "react-canvas-polygons";

const ImageDrawer = ({ objects, newObjects, onNewObject, image, size }, ref) => {

  useEffect(() => {
    const canvas = ref
    var ctx = canvas.ctx

    for (let obj of objects.data) {
      ctx.beginPath();
      ctx.fillStyle = obj.color + "40"
      for (let [x, y] of obj.mask_points[0]) {
        ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();

      ctx.font = "20px Arial";
      ctx.fillStyle = "purple";
      ctx.fillText(`${obj.object_name} (${obj.confidence.toFixed(2)})`, obj.mask_points[0][0][0], obj.mask_points[0][0][1]);
    }

  }, [])

  const [tool, setTool] = useState("Line");
  const handleCleanCanva = (e) => {
    e.stopPropagation();
    ref.cleanCanvas();
    setTool("Line");
    const timeout = setTimeout(() => setTool("Polygon"), 50);
    return () => clearTimeout(timeout);
  };
  useEffect(() => {
    const timeout = setTimeout(() => setTool("Polygon"), 50);
    return () => clearTimeout(timeout);
  }, []);
  return (
    <div>
      <button
        variant="outlined"
        style={{ marginBottom: "20px" }}
        onClick={handleCleanCanva}
      >
        Clean Canvas
      </button>
      <Canvas
        id="canvas"
        ref={(canvas) => (ref = canvas)}
        imgSrc={image}
        height={size.h}
        width={size.w}
        tool={tool}
        onDataUpdate={(data) => onNewObject(data)}
        onFinishDraw={(data) => onNewObject(data)}
        initialData={newObjects}
      />
    </div>
  );
};

export default ImageDrawer;
