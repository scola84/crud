import CrudWorker from '../../worker/crud';

export default class LinkGetter extends CrudWorker {
  act(route, data) {
    this.pass({
      box: route,
      url: {
        path: '/api/' + this._name + '/' + route.params.id + '/' +
          this._link + '/' + route.params.lid,
        query: data
      }
    });
  }
}
