# Files

Files selected come in fileList form which not a array but can be loop using

```js
Array.from(files).forEach((file) => {
  /// code here
});
```

File are superset of blobs

## Creating a file

```js
const file = new File([buffer], "newFile.txt", { type: "text/plane" });
console.log(file);
```

## downloading a file

```js
//download
const url = URL.createObjectURL(file);
const a = document.createElement("a");
a.href = url;
a.download = file.name;
a.textContent = "downloadFile";
createDiv.current?.append(a); // or a.click()
```

## Selecting a File

```js
    <label htmlFor="fileInput">Label</label>
    <input type="file" accept=".json" onChange={handleFiles} multiple id="fileInput" className="hidden" />
```

### View Selected files

```js
const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    console.log(files);
  };
```

### Get file or a blob url

```js
const url = URL.createObjectURL(file);
```

# ArrayBuffer

It is stored data in binary form

```js
const buffer = new Buffer(2); // 2 bytes /1byte = 8bits -->0-255
```

# Blob

```js
const blob = new Blob([buffer]);

// onload is a event listner so before read to work
const reader = new FileReader();
reader.onload = function () {
  console.log(reader.result); // Outputs: Hello, world!
};
reader.readAsText(blob);
```

# Blob VS ArrayBuffer

Use `ArrayBuffer` when you need to manipulate `binary data` directly and require a fixed-length buffer.\
Use `Blob` when you are dealing with `file-like data` and need to `handle media` types or perform file operations.\

# DataView

TO read and write `bufferArray` you need a view or TypedArray

```js
const dataView = new DataView(buffer); // dataview is need to write and read files
dataView.setInt8(1, 1); // write in 8 bits or 1 bytes
dataView.setInt8(5, 104);
dataView.setInt8(6, 105);
```

# Uint8Array

Uint8Array is a subclass of the hidden TypedArray class.\

Uint8Array,Uint16Array,Uint32Array,Uint64Array

can be used to read and write buffer

```js
console.log(new Uint8Array(buffer).toString());
const view = new Uint8Array(buffer);
view[2] = 123;
view.forEach((val) => {
  console.log(val);
});
```

# FileReader

Read Media File

```js
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const file = files[0];
    const reader = new FileReader();
        // onload is a event listner so before read to work
    reader.onload = () => {
      setSrc(reader.result);
    };
    reader.readAsDataURL(file);
  };
```

Read textfile

```js
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
```

# Caches

```js
 //CACHES
    caches.delete(name).then(isGone=>{});
    caches.has(name).then(hasFile=>{});
    caches.keys().then(namesArray=>{});
    caches.match(Request).then(cacheResponse=>{});
    caches.open(name).then(cache=>{});

    //CACHE - from caches.open()
    cache.add(Request).then(()=>{}); //fetch and put
    cache.addAll(Requests[]).then(()=>{}); //fetch and put
    //add and addAll === fetch() + cache.put()
    cache.delete(Request, options).then(isGone=>{});
    cache.keys([Request, options]).then((keysArray)=>{});
    cache.match(Request, options).then((cacheResponse)=>{});
    cache.matchAll([Request, options]).then((cacheResponses[])=>{});
    cache.put(Request, Response).then(()=>{}); // put response object
```

# Service Worker

register and manupulate worker

```
project
|
|/src
|/sw.js
```

```js
export const SW_OBJ: {
  SW: null | ServiceWorker;
  init: () => void;
  unregister: () => void;
  getStorageSpace: () => Promise<
    | {
        quota?: number;
        usage?: number;
      }
    | undefined
  >;
  onMessage: (ev: MessageEvent<unknown>) => void;
  sendMessage: (msg: unknown) => Promise<void>;
} = {
  SW: null,
  init: () => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", {
          scope: "/",
          type: "module",
        })
        .then((registered) => {
          SW_OBJ.SW = registered.installing || registered.waiting || registered.active;
          console.log("service worker is registered");
        });

      // 2. See if the page is currently has a service worker.
      if (navigator.serviceWorker.controller) {
        console.log("we have a service worker installed");
      }

      // 3. Register a handler to detect when a new or
      // updated service worker is installed & activate.
      navigator.serviceWorker.oncontrollerchange = () => {
        console.log("New service worker activated");
      };

      navigator.serviceWorker.addEventListener("controllerchange", async () => {
        SW_OBJ.SW = navigator.serviceWorker.controller;
      });
      //listen for messages from the service worker
      navigator.serviceWorker.addEventListener("message", SW_OBJ.onMessage);
    } else {
      console.log("service worker is not supported");
    }
  },
  unregister: () => {
    if ("serviceWorker" in navigator) {
      // 4. remove/unregister service workers
      navigator.serviceWorker.getRegistrations().then((regs) => {
        for (const reg of regs) {
          reg.unregister().then((isUnreg) => console.log(isUnreg));
        }
      });
    }
  },
  getStorageSpace: async () => {
    if ("storage" in navigator) {
      const storage = await navigator.storage.estimate();
      return storage;
    }
  },
  sendMessage: async (msg) => {
    //send some structured-cloneable data from the webpage to the sw
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage(msg);
    }
  },
  onMessage: async ({ data }) => {
    //got a message from the service worker
    alert(data);
  },
};

```

## SW.js

> [!tip]
> Use `ev.clientId` in '`fetch`' eventListner
> use ` ev.source.id` in '`message`' eventListner

```js
import BrowserCaches from "./src/utilty/BrowserCaches";
const url = "/vite.svg";

function code() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("teja");
      resolve();
    }, 2000);
  });
}

const handleSave = async () => {
  const cache = await caches.open("test");
  const isSaved = await cache.match(url);
  if (!isSaved) {
    await cache.add(url);
  }
};

self.addEventListener("install", (ev) => {
  //service worker is installed.
  ev.waitUntil(handleSave());
  self.skipWaiting(); //skip waiting to activate
  console.log("installed");
});

self.addEventListener("activate", (ev) => {
  //service worker is activated
  console.log("activated");

  clients.claim().then(() => {
    //claim means that the html file will use this new service worker.
    console.log("the service worker has now claimed all pages so they use the new service worker.");
  });
});

self.addEventListener("fetch", (ev) => {
  //service worker intercepted a fetch call
  console.log("intercepted a http request", ev.request);
});

self.addEventListener("message", (ev) => {
  //message from webpage
});
```

### WaitUntil

the `ExtendableEvent.waitUntil()` method extends the lifetime of the event./

If you don't call it inside a method, the service worker could be `stopped at any time` (see the specification)./

So, the waitUntil method is used to tell the browser not to terminate the service worker until the promise passed to waitUntil is either resolved or rejected./

In the case of the `install` and the `activate` events, it delays the state switch of the service worker to installed and activated/

```js
ev.waitUntil(code()); // ev.waitUntil(Promise) if async function call it
```

### SkipWaiting() && Claim()

skipWaiting() /

A service worker is activated after it is installed, and if there is no other service worker that is currently controlling pages within the scope. In other words, if you have any number of tabs open for a page that is being controlled by the old service worker, then the new service worker will not activate. You can therefore activate the new service worker by closing all open tabs. After this, the old service worker is controlling zero pages, and so the new service worker can become active./

Claim()/

serviceWorker will claim all existing tabs from old service worker.

```js
self.addEventListener("install", (ev) => {
  self.skipWaiting(); //skip waiting to activate
});

self.addEventListener("activate", (ev) => {
  clients.claim().then(() => {
    console.log("the service worker has now claimed all pages so they use the new service worker.");
  });
});
```

### respondwith()

Intercept fetch call and respond with any '`Response`'.

> [!CAUTION]
> Do not forget to clone response before returning in case of fetch

```js
self.addEventListener("fetch", (ev) => {
  if (ev.request.url.startsWith("ws://")) { /// stop from interfering with localhost vite server
    console.log("not stoping");
  } else {
    ev.respondWith(
      (async () => {
        const res: Response = await handleRequest(ev);
        return res;
      })()
    );
  }
});
```

```js
async function handleRequest(ev: FetchEvent) {
  const cacheRes = await caches.match(ev.request);// check for caches or to fetch
  return cacheRes || (await fetchAndSaveInCaches(ev.request));
}
```

> [!CAUTION]
> Do not forget to cors the request if needed.
> Do not forget to set credentials if needed.

```js
  let cachesName = "default";
const fetchAndSaveInCaches = async (req: Request) => {
  const opts: RequestInit = {
    cache: "no-cache",
    mode: "cors",
  };
  // check if reqest is being made outside the origin
  if (!req.url.startsWith(location.origin)) {
    opts.mode = "cors";
    opts.credentials = "omit";
  }

 try {
    const response = await fetch(req, opts);
    if (response && response.headers.has("content-type")) {
      const contentType = response.headers.get("content-type") || "";
      cachesName = contentType.match(/^text\/css/is) ? "css" : cachesName;
      cachesName = contentType === "text/javascript" ? "javascript" : cachesName;
      cachesName = contentType === "text/html" ? "html" : cachesName;
      cachesName = contentType === "text/css" ? "css" : cachesName;
    }

    const cache = await caches.open(cachesName);
    await cache.put(req, response.clone());
    return response;
  } catch {
    const cacheRes = await caches.match("/");
    return cacheRes;
  }
};
```

## ServiceWorer Send And receive message

```js
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
```

# Window

## Open new Tab && SendMessage

```js
 openTab: () => {
    const wn = window.open("/");
    if (wn) SW_OBJ.WN = wn;
  },
  sendMessageToTab: (msg: string) => {
    console.log(SW_OBJ.WN);
    if (SW_OBJ.WN) {
      SW_OBJ.WN.postMessage(msg);
    }
  },
```

## GetMessage

```js
  window.addEventListener("message", (e: MessageEvent<unknown>) => {
    console.log(e.data)}
    )
```
