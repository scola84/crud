import { GraphicWorker } from '@scola/gui';
import { event, select } from 'd3';

export default class LinkClicker extends GraphicWorker {
  act(route, data, callback) {
    route.list.enter
      .selectAll('.button[tabindex="0"]')
      .on('click', (d, i, n) => {
        event.stopPropagation();
        this.route(d, i, n, { data, name: 'edit', route });
      });

    route.list.enter
      .filter((datum, index, nodes) => {
        return select(nodes[index]).classed('disabled') === false;
      })
      .on('click', (d, i, n) => {
        this.route(d, i, n, { data, name: 'view', route });
      });

    this.pass(route, data, callback);
  }
}
