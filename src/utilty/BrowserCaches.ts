class BrowserCaches {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  async add(url: string) {
    const cache = await caches.open(this.name);
    const isSaved = await cache.match(url);
    if (!isSaved) {
      await cache.add(url);
    }
  }
  async delete(url: string) {
    const cache = await caches.open(this.name);
    const isSaved = await cache.match(url);
    if (isSaved) {
      await cache.delete(url);
    }
  }
  async match(url: string) {
    const b = await caches.match(url);
    console.log(b);
  }
}

export default BrowserCaches;
