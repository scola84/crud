import CrudWorker from '../../worker/crud';

export default class ListGetter extends CrudWorker {
  act(route, data) {
    this.pass({
      box: route,
      url: {
        path: '/api/' + this._name,
        query: data
      }
    });
  }
}
