import { select } from 'd3';
import Resolver from '../worker/resolver';

export default class ObjectResolver extends Resolver {
  act(route, data, callback) {
    if (route.response.request.method === 'PUT') {
      this._resolvePut(route);
    } else {
      super.act(route, data, callback);
    }
  }

  _resolveDelete(route) {
    const response = route.response;
    const deleted = response.request.method === 'DELETE' &&
      response.request.url.query === null;

    select(route.node)
      .classed('deleted', deleted);
  }
}
