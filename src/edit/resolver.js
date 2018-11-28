import { select } from 'd3';
import Resolver from '../worker/resolver';

export default class ObjectResolver extends Resolver {
  act(route, data, callback) {
    data = this.filter(route, data);

    if (route.response.request.method === 'DELETE') {
      this._resolveDelete(route, data);
      return;

    }

    super.act(route, data, callback);
  }

  _resolveDelete(route, data) {
    if (data.action === 'fdelete') {
      this.route(null, null, null, { data, name: 'done', route });
      return;
    }

    const panel = select(route.node);

    panel
      .selectAll('form')
      .attr('action', null);

    panel
      .classed('deleted', data.action === 'delete' ? true : false);
  }
}
