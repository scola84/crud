import { GraphicWorker } from '@scola/gui';

export default class CrudWorker extends GraphicWorker {
  constructor(options = {}) {
    super(options);

    this._id = null;
    this._link = null;
    this._name = null;

    this.setLink(options.link);
    this.setName(options.name);
  }

  setLink(value = null) {
    this._link = value;
    return this;
  }

  setName(value = null) {
    this._name = value;
    this._id = value + '_id';

    return this;
  }
}
