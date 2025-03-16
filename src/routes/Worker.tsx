import { useEffect } from "react";

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

export default function Worker() {
  useEffect(() => {
    SW_OBJ.init();
  }, []);

  return (
    <div>
      SW
      <button onClick={SW_OBJ.unregister}>Unregister</button>
      <button onClick={SW_OBJ.init}>register</button>
    </div>
  );
}
