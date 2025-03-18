export const SW_OBJ: {
  SW: null | ServiceWorker;
  WN: Window | null;
  openTab: () => void;
  init: () => void;
  unregister: () => void;
  sendMessageToTab: (msg: string) => void;
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
  WN: null,
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
};
