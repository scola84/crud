import { GraphicWorker, getView } from '@scola/gui';
import { select } from 'd3';

export default class ListClicker extends GraphicWorker {
  act(route, data, callback) {
    route.list.enter
      .filter((datum, index, nodes) => {
        return select(nodes[index]).classed('disabled') === false;
      })
      .on('click', (d, i, n) => {
        select('body').dispatch('click');
        this.route(d, i, n, { getView, data, route });
      });

    this.pass(route, data, callback);
  }
}
