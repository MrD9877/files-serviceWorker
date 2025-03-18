import { useCallback, useEffect, useState } from "react";
import { SW_OBJ } from "../utilty/SWObject";

export default function Worker() {
  const [msg, setMsg] = useState("");

  const handleMessage = useCallback((e: MessageEvent<unknown>) => {
    console.log(e.data);
    console.log("hit");
  }, []);

  useEffect(() => {
    try {
      SW_OBJ.sendMessage("id");
    } catch {
      console.log("err");
    }
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [handleMessage]);

  useEffect(() => {
    SW_OBJ.init();
  }, []);

  const showStorage = async () => {
    const storage = await SW_OBJ.getStorageSpace();
    if (storage) {
      console.log(`use ${storage.usage ? storage.usage / 1024 : ""} kb from ${storage.quota ? storage.quota / 1024 / 1024 / 1024 : ""} gb`);
      alert(`use ${storage.usage ? storage.usage / 1024 : ""} kb from ${storage.quota ? storage.quota / 1024 / 1024 / 1024 : ""} gb`);
    }
  };

  return (
    <div className="flex gap-4 flex-col">
      SW
      <button onClick={SW_OBJ.unregister}>Unregister</button>
      <button onClick={SW_OBJ.init}>register</button>
      <button onClick={showStorage}>Storage</button>
      <div className="flex gap-4">
        <input className="px-3 py-1 text-black bg-white" type="text" value={msg || ""} onChange={(e) => setMsg(e.target.value)} />
        <button onClick={() => SW_OBJ.sendMessage(msg)}>Send Message to worker</button>
      </div>
      <div className="flex gap-4">
        <input className="px-3 py-1 text-black bg-white" type="text" value={msg || ""} onChange={(e) => setMsg(e.target.value)} />
        <button onClick={() => SW_OBJ.openTab()}>Open new tab</button>
        <button onClick={() => SW_OBJ.sendMessageToTab(msg)}>Send message to tab</button>
      </div>
    </div>
  );
}
