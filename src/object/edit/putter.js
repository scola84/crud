import CrudWorker from '../../worker/crud';

export default class ObjectPutter extends CrudWorker {
  act(route, data) {
    this.pass({
      box: route,
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'PUT',
      url: {
        path: '/api/' + this._name + '/' + data[this._id],
      }
    }, data);
  }
}
