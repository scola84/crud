import CrudWorker from '../../worker/crud';

export default class LinkDeleter extends CrudWorker {
  act(route, data) {
    this.pass({
      box: route,
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'DELETE',
      url: {
        path: '/api/' + this._name + '/' +
          route.params.id + '/' + this._link,
      }
    }, data);
  }
}
