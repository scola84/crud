import { GraphicWorker } from '@scola/gui';
import { select } from 'd3';

export default class SelectClicker extends GraphicWorker {
  act(route, data, callback) {
    route.list.empty
      .filter((datum, index, nodes) => {
        return select(nodes[index]).classed('disabled') === false;
      })
      .on('click', (d, i, n) => {
        this.route(d, i, n, { route, data });
      });

    this.pass(route, data, callback);
  }
}
