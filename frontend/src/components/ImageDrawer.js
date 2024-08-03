import { useEffect, useState } from "react";
import Canvas from "react-canvas-polygons";

const ImageDrawer = ({ objects, image, size, onNewPolygon }, ref) => {

  const [polygon, setPolygon] = useState()
  const [tool, setTool] = useState("Line");

  useEffect(() => {
    ref.cleanCanvas()

    setTool("Line")
    const timeout = setTimeout(() => setTool("Polygon"), 50);


    if (objects) {

      for (let obj of objects) {
        const ctx = ref.ctx
        ctx.beginPath();

        ctx.fillStyle = obj.color
        ctx.font = "20px Arial";
        ctx.fillText(`${obj.object_name} (${obj.confidence.toFixed(2)})`, obj.mask_points[0][0][0], obj.mask_points[0][0][1]);

        console.log("A", ctx.fillStyle)

        ctx.fillStyle = obj.color + "40"
        for (let [x, y] of obj.mask_points[0]) {
          ctx.lineTo(x, y);
        }
        ctx.fill();
        // ctx.closePath();

        console.log("B", ctx.fillStyle)

        ctx.strokeStyle = obj.color;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    return () => clearTimeout(timeout);

  }, [objects])

  return (
    <div className="mx-auto flex justify-center">
      <Canvas
        id="canvas"
        ref={(canvas) => (ref = canvas)}
        imgSrc={image}
        height={size.h}
        width={size.w}
        tool={tool}
        onDataUpdate={(data) => setPolygon(data)}
        onFinishDraw={() => onNewPolygon(polygon)}
        initialData={polygon}
      />
    </div>
  );
};

export default ImageDrawer;
