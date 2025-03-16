import React, { useRef, useState } from "react";
import ShowImage from "../components/Image";

export default function Files() {
  const createDiv = useRef<HTMLDivElement>(null);
  const [image, setImage] = useState<File>();
  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = function () {
        console.log(reader.result);
      };
      file.arrayBuffer().then((buffer) => {
        const blob = new Blob([buffer]);
        reader.readAsText(blob);
      });
    });
    console.log(files);
  };
  const createFile = () => {
    //buffer
    const buffer = new ArrayBuffer(4); //10bytes / 1byte = 8btits --> 0-255

    //dataView
    const dataView = new DataView(buffer); // dataview is need to edit files
    dataView.setInt8(0, 106);
    dataView.setInt8(1, 104);
    dataView.setInt8(3, 105);

    //typedArray
    const view = new Uint8Array(buffer);
    view[2] = 112;
    view.forEach((val) => {
      console.log(val);
    });
    console.log(view.toString());

    //blob
    const blob = new Blob([buffer]);
    const reader = new FileReader();
    // onload is a event listner so before read to work
    reader.onload = function () {
      console.log(reader.result); // Outputs: Hello, world!
    };
    reader.readAsText(blob);
    // reader.readAsDataURL(blob);

    //file
    const file = new File([buffer], "newFile.txt", { type: "text/plane" });
    console.log(file);

    //download
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.textContent = "downloadFile";
    createDiv.current?.append(a);
  };

  // const createImg = async (url: string) => {
  //   const img = document.createElement("img");
  //   img.src = url;
  //   createDiv.current?.append(img);
  // };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const file = files[0];
    setImage(file);
  };

  // const fetchd = async () => {
  //   const res = await fetch("api");
  //   const copy = res.clone();
  // };
  return (
    <div>
      <div>
        <label htmlFor="fileInput">Label</label>
        <input type="file" accept=".json" onChange={handleFiles} multiple id="fileInput" className="hidden" />
      </div>
      <div>
        <input type="file" accept="image/*" onChange={handleImage} />
      </div>
      <div ref={createDiv}>
        <button onClick={createFile}>Create File</button>
      </div>
      <ShowImage image={image} />
    </div>
  );
}
