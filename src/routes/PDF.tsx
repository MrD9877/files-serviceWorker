import React, { useState } from "react";
import { jsPDF } from "jspdf";
import PdfViewer from "../components/PDFviewer";

export default function PDF() {
  const [url, setUrl] = useState<string>();
  function create() {
    // const doc = new jsPDF();

    // doc.text("Hello world!", 10, 10);
    // doc.save("a4.pdf");

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "in",
      format: [4, 2],
    });

    doc.text("Hello world!", 1, 1);
    doc.save("two-by-four.pdf");
  }
  const handlePdF = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const url = URL.createObjectURL(files[0]);
      setUrl(url);
    }
  };
  return (
    <div>
      <div>
        <button onClick={create}>Create</button>
        <a href="/test.pdf">s</a>
        <input type="file" accept=".pdf" onChange={handlePdF} />
        {/* <div>{url && <embed src={url} width="100%" height="600px" type="application/pdf" />}</div> */}
        <div>{url && <PdfViewer url={url} />}</div>
      </div>
    </div>
  );
}
