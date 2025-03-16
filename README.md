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

project\
|
|/src
|/sw.js

```js
const SW_OBJ: { SW: null | ServiceWorker; init: () => void; unregister: () => void } = {
  SW: null,
  init: () => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", {
          scope: "/",
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
};

```

## SW.js

```js
//our service worker
console.log("sw running");
//new

//console.log({ self });
self.addEventListener("install", (ev) => {
  //service worker is installed.
  console.log("installed");
});
self.addEventListener("activate", (ev) => {
  //service worker is activated
  console.log("activated");
});

self.addEventListener("fetch", (ev) => {
  //service worker intercepted a fetch call
  console.log("intercepted a http request", ev.request);
});

self.addEventListener("message", (ev) => {
  //message from webpage
});
//
```
