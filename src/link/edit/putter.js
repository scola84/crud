import CrudWorker from '../../worker/crud';

export default class LinkPutter extends CrudWorker {
  act(route, data) {
    this.pass({
      box: route,
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'PUT',
      url: {
        path: '/api/' + this._name + '/' + route.params.id + '/' +
          this._link + '/' + route.params.lid,
      }
    }, data);
  }
}
