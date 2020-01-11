export default class Store {
  constructor(key, storage) {
    this._key = key;
    this._storage = storage;
  }

  getAll() {
    try {
      return JSON.parse(this._storage.getItem(this._key));
    } catch (err) {
      return {};
    }
  }

  setItem(key, value) {
    const store = this.getAll();
    this._storage.setItem(this._key, JSON.stringify(Object.assign({}, store, {
      [key]: value})));
  }

  deleteItem(key) {
    const store = this.getAll();
    delete store[key];
    this._storage.setItem(this._key, JSON.stringify(Object.assign({}, store)));
  }

  clear() {
    this._storage.setItem(this._key, ``);
  }
}
