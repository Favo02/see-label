import { useEffect, useState } from "react";
import Canvas from "react-canvas-polygons";

const DrawCanvas = ({ initialData, onChange, image }, ref) => {

  console.log("IN CANVAS", initialData)

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
        ref={(canvas) => (ref = canvas)}
        imgSrc={image}
        height={800}
        width={800}
        tool={tool}
        onDataUpdate={(data) => onChange(data)}
        onFinishDraw={(data) => onChange(data)}
        initialData={initialData}
      />
    </div>
  );
};

export default DrawCanvas;
