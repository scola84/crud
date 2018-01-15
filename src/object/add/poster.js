import CrudWorker from '../../worker/crud';

export default class ObjectPoster extends CrudWorker {
  act(route, data) {
    this.pass({
      box: route,
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      url: {
        path: '/api/' + this._name,
      }
    }, data);
  }
}
