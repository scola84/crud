import { GraphicWorker } from '@scola/gui';
import { event, select } from 'd3';
import { handleGui } from '../helper';

export default class SummaryClicker extends GraphicWorker {
  act(route, data, callback) {
    route.summary
      .selectAll('.primary:empty + .secondary .title :not(.l3) a')
      .on('click', (d, i, n) => {
        event.preventDefault();

        const handler = handleGui({
          summary: select(n[i]).attr('href').slice(2)
        })();

        handler(d, i, n, { name: 'summary' });
      });

    route.summary
      .selectAll('.actions li')
      .on('click', (d, i, n) => {
        this.route(d, i, n, { data, route });
      });

    this.pass(route, data, callback);
  }
}
