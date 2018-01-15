import { getView } from '@scola/gui';
import { select } from 'd3';
import CrudWorker from '../../worker/crud';

export default class ObjectResolver extends CrudWorker {
  act(route) {
    if (route.response.request.method === 'PUT') {
      this._resolvePut(route);
    } else {
      this._resolveDelete(route);
    }
  }

  _resolveDelete(route) {
    const response = route.response;
    const deleted = response.request.method === 'DELETE' &&
      response.request.url.query === null;

    select(route.node)
      .classed('deleted', deleted);
  }

  _resolvePut(route) {
    getView('main').handle({
      back: true,
      name: 'view-' + this._name,
      params: route.params
    });
  }
}
