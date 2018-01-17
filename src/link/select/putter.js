import CrudWorker from '../../worker/crud';

export default class LinkPutter extends CrudWorker {
  act(route, data) {
    const [action] = route.name.split('-');
    const method = action === 'select' ? 'PUT' : 'POST';

    this.pass({
      box: route,
      headers: {
        'Content-Type': 'application/json'
      },
      method,
      url: {
        path: '/api/' + this._name + '/' +
          route.params.id + '/' + this._link,
      }
    }, data);
  }
}
