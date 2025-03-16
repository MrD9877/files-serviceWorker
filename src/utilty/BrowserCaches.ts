class BrowserCaches {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  async add() {
    const cache = await caches.open(this.name);
    const isSaved = await cache.match("/loadingGIF.gif");
    if (!isSaved) {
      await cache.add("/loadingGIF.gif");
    }
  }
  async delete() {
    const cache = await caches.open(this.name);
    const isSaved = await cache.match("/loadingGIF.gif");
    if (isSaved) {
      await cache.delete("/loadingGIF.gif");
    }
  }
}

export default BrowserCaches;
