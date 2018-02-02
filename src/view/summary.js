import { GraphicWorker, getView } from '@scola/gui';

export default class SummaryClicker extends GraphicWorker {
  act(route, data, callback) {
    route.summary
      .selectAll('.edit button')
      .on('click', (d, i, n) => {
        this.route(d, i, n, { getView, data, route });
      });

    this.pass(route, data, callback);
  }
}
