import { GraphicWorker } from '@scola/gui';

export default class CheckerMerger extends GraphicWorker {
  act(route, data, callback) {
    route.checked = data.data;
    this.pass(route, callback);
  }
}
