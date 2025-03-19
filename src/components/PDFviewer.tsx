import { useEffect, useRef } from "react";
import pdfjsLib from "pdfjs-dist";

const PdfViewer = ({ url }: { url: string }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (url && canvasRef.current) {
      pdfjsLib.getDocument(url).promise.then((pdf) => {
        pdf.getPage(1).then((page) => {
          const canvas = canvasRef.current;
          if (!canvas) return;
          const context = canvas?.getContext("2d");
          const viewport = page.getViewport({ scale: 1 });
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          if (context) {
            page.render({
              canvasContext: context,
              viewport: viewport,
            });
          }
        });
      });
    }
  }, [url]);

  return <canvas ref={canvasRef} />;
};

export default PdfViewer;
