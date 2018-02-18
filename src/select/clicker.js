import { GraphicWorker } from '@scola/gui';
import { select } from 'd3';

export default class SelectClicker extends GraphicWorker {
  act(route, data, callback) {
    route.list.empty
      .on('click', (datum, index, nodes) => {
        if (select(nodes[index]).classed('disabled') === true) {
          return;
        }

        this.route(datum, index, nodes, { route, name: 'add', data });
      });

    this.pass(route, data, callback);
  }
}
