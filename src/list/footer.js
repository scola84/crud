import { GraphicWorker } from '@scola/gui';
import { select } from 'd3';

export default class ListFooter extends GraphicWorker {
  act(route, data, callback) {
    const panel = select(route.node)
      .classed('footer outset', true);

    const header = panel
      .select('.footer');

    const right = header
      .select('.right');

    right
      .append('button')
      .attr('tabindex', 0)
      .classed('button icon delete ion-ios-refresh', true)
      .on('click', () => {
        route.reload();
      });

    this.pass(route, data, callback);
  }
}
