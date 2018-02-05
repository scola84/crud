import { GraphicWorker } from '@scola/gui';

export default class ViewMerger extends GraphicWorker {
  act(route, data, callback) {
    route.checked = Array.isArray(data.data) ? data.data : [data.data];
    this.pass(route, callback);
  }
}
