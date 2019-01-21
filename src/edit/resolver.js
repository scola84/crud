import { select } from 'd3';
import Resolver from '../worker/resolver';

export default class DeleteResolver extends Resolver {
  act(route, data) {
    data = this.filter(route, data);

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
