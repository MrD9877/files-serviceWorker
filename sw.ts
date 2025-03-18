export default null;
declare const self: ServiceWorkerGlobalScope;
declare const clients: Clients;
const html = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    yo
  </body>
</html>
`;

const version = 13;

const cacheNameArray = [`default-version-${version}`, `javascript-version-${version}`, `html-version-${version}`, `css-version-${version}`];

const fetchAndSaveInCaches = async (req: Request) => {
  let cachesName = "default";
  const opts: RequestInit = {
    cache: "no-cache",
    mode: "cors",
  };
  if (!req.url.startsWith(location.origin)) {
    //not on the same domain as my html file
    opts.mode = "cors";
    opts.credentials = "omit";
  }
  try {
    const response = await fetch(req, opts);

    if (response && response.headers.has("content-type")) {
      const contentType = response.headers.get("content-type") || "";
      cachesName = contentType === "text/javascript" ? "javascript" : cachesName;
      cachesName = contentType === "text/html" ? "html" : cachesName;
      cachesName = contentType === "text/css" ? "css" : cachesName;
    }

    const cache = await caches.open(`${cachesName}-version-${version}`);
    await cache.put(`${req.url}-version-${version}`, response.clone());
    return response;
  } catch {
    const cacheRes = await caches.match("/");
    const res = new Response(html);
    res.headers.set("content-type", "text/html");
    return cacheRes || res;
  }
};

async function handleRequest(ev: FetchEvent) {
  const cacheRes = await caches.match(`${ev.request.url}-version-${version}`);
  return cacheRes || (await fetchAndSaveInCaches(ev.request));
}

function code() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("");
    }, 2000);
  });
}

const deleteOldCaches = async () => {
  const cachesArr = await caches.keys();

  for (let i = 0; i < cachesArr.length; i++) {
    const currCache = cachesArr[i];
    if (!cacheNameArray.includes(currCache)) {
      await caches.delete(currCache);
    }
  }
};

self.addEventListener("install", (ev) => {
  //service worker is installed.
  ev.waitUntil(code());
  ev.waitUntil(deleteOldCaches());
  self.skipWaiting(); //skip waiting to activate
  console.log("installed");
});

self.addEventListener("activate", () => {
  //service worker is activated
  console.log("activated");
  clients.claim().then(() => {
    //claim means that the html file will use this new service worker.
    console.log("the service worker has now claimed all pages so they use the new service worker.");
  });
});

self.addEventListener("fetch", (ev) => {
  if (!ev.request.url.startsWith("ws://")) {
    ev.respondWith(
      (async () => {
        const res: Response = await handleRequest(ev);
        return res;
      })()
    );
  }
});

self.addEventListener("message", (ev) => {
  //message from webpage
  const data = ev.data;
  if (ev.source && "id" in ev.source) {
    const clientId = ev.source.id;
    console.log(`from worker msg received : ${data} from id ${clientId}`);
    ev.waitUntil(sendMessage(data, clientId));
  }
});

const sendMessage = async (msg: string, clientId: string) => {
  if (clientId) {
    const client = await clients.get(clientId);
    if (client) return client.postMessage(`${clientId} thanks for msg:${msg}`);
  }
};
