import CrudWorker from '../../worker/crud';

export default class LinkMerger extends CrudWorker {
  act(route, data, callback) {
    route.checked = data;
    this.pass(route, callback);
  }
}
