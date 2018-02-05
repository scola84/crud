import { select } from 'd3';
import Resolver from '../worker/resolver';

export default class ObjectResolver extends Resolver {
  act(route, data, callback) {
    if (route.response.request.method === 'PUT') {
      super.act(route, data, callback);
    } else {
      this._resolveDelete(route);
    }
  }

  _resolveDelete(route) {
    const panel = select(route.node);

    panel
      .selectAll('form')
      .attr('action', null);

    panel
      .classed('deleted', !panel.classed('deleted'));
  }
}
