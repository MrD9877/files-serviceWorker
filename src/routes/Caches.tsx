import BrowserCaches from "../utilty/BrowserCaches";

export default function Caches() {
  const handleSave = async () => {
    const cache = new BrowserCaches("test");
    await cache.add();
  };
  const deleteSave = async () => {
    const cache = new BrowserCaches("test");
    await cache.delete();
  };
  return (
    <div>
      <div>
        <button onClick={handleSave}>Save Image in Cache</button>
        <button onClick={deleteSave}>delete Image in Cache</button>
      </div>
    </div>
  );
}
