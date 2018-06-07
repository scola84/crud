import { GraphicWorker } from '@scola/gui';
import { event, select } from 'd3';
import { normalizeLink } from '../helper';

export default class LinkClicker extends GraphicWorker {
  act(route, data, callback) {
    route.list.enter
      .selectAll('.button[tabindex="0"]')
      .on('click', (d, i, n) => {
        event.stopPropagation();
        this.route(d, i, n, { data, name: 'edit', route });
      });

    route.list.enter
      .on('click', (datum, index, nodes) => {
        if (select(nodes[index]).classed('disabled') === true) {
          return;
        }

        const dIndex = normalizeLink(this._structure, datum);

        const d = {
          [datum.view.id]: data.link[dIndex].id,
          id: data.link[dIndex].id
        };

        this.route(datum, index, nodes, { data: d, name: 'view', route });
      });

    this.pass(route, data, callback);
  }
}
