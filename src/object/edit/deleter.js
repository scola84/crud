import CrudWorker from '../../worker/crud';

export default class ObjectDeleter extends CrudWorker {
  act(route, data) {
    this.pass({
      box: route,
      method: 'DELETE',
      url: {
        path: '/api/' + this._name + '/' + data[this._id],
        query: data.undelete ? { undelete: data.undelete } : null
      }
    });
  }
}
