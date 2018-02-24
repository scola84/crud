import { select } from 'd3';
import Resolver from '../worker/resolver';

export default class ObjectResolver extends Resolver {
  act(route, data, callback) {
    if (route.response.request.method === 'DELETE') {
      this._resolveDelete(route);
    } else {
      super.act(route, data, callback);
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
