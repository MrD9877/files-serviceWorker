import React, { useEffect, useState } from "react";

export default function ShowImage({ image }: { image: File | undefined }) {
  const [count, setCount] = useState(225);
  const [src, setSrc] = useState<string | ArrayBuffer | null>();

  const getUrl = async () => {
    if (!image) return;
    const buffer = await image.arrayBuffer();
    console.log(buffer);
    const view = new Uint8Array(buffer);
    // 255 224 0 16
    view[3] = count;
    const modiFiedFile = new File([buffer], "s.png", { type: image.type });

    const reader = new FileReader();
    reader.onload = () => {
      console.log(reader.result);
      setSrc(reader.result);
    };
    reader.readAsDataURL(modiFiedFile);
  };
  useEffect(() => {
    getUrl();
  }, [count]);
  return (
    <div>
      <div className="flex gap-4">
        <button className="p-4 bg-amber-800 border border-black" onClick={() => setCount((pre) => pre + 1)}>
          +
        </button>
        {count}
        <button className="p-4 bg-amber-800 border border-black" onClick={() => setCount((pre) => pre - 1)}>
          -
        </button>
      </div>
      {src && typeof src === "string" && <img src={src} alt="dnvsdvn" className="w-64 h-64" />}
    </div>
  );
}
