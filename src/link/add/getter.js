import CrudWorker from '../../worker/crud';

export default class LinkGetter extends CrudWorker {
  act(route, data) {
    this.pass({
      box: route,
      url: {
        path: '/api/' + this._link,
        query: data
      }
    });
  }
}
