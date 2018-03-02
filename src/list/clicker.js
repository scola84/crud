import { GraphicWorker } from '@scola/gui';
import { event, select } from 'd3';
import { normalizeList } from '../helper';

export default class ListClicker extends GraphicWorker {
  act(route, data, callback) {
    route.list.enter
      .on('click', (datum, index, nodes) => {
        select('body').dispatch('click');

        const target = select(event.target);
        datum = target.datum();

        const options = { disabled: false };
        const dIndex = normalizeList(datum, index, nodes, options);

        const d = data.data[dIndex];
        const disabled = select(nodes[index]).classed('disabled');

        const name = target.classed('button') ? 'edit' : 'view';

        if (name === 'view' && disabled === true) {
          return;
        }

        this.route(datum, index, nodes, { data: d, name, route });
      });

    this.pass(route, data, callback);
  }
}
