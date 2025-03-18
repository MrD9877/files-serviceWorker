import BrowserCaches from "../utilty/BrowserCaches";
const url = "http://localhost:3000/home";

export default function Caches() {
  const handleSave = async () => {
    const cache = new BrowserCaches("test");
    await cache.add(url);
  };
  const deleteSave = async () => {
    const cache = new BrowserCaches("test");
    await cache.delete(url);
  };
  const match = async () => {
    const cache = new BrowserCaches("test");
    await cache.match(url);
  };
  const fetchfn = async () => {
    try {
      const res = await fetch(url, { mode: "cors" });
      console.log(res.status);
    } catch {
      console.log("error");
    }
  };
  return (
    <div>
      <div>
        <button onClick={handleSave}>Save Image in Cache</button>
        <button onClick={deleteSave}>delete Image in Cache</button>
        <button onClick={match}>Match</button>

        <button onClick={fetchfn}>Fetch</button>
      </div>
    </div>
  );
}
