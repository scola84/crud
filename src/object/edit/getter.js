import CrudWorker from '../../worker/crud';

export default class ObjectGetter extends CrudWorker {
  act(route) {
    this.pass({
      box: route,
      url: {
        path: '/api/' + this._name + '/' + route.params.id,
      }
    });
  }
}
