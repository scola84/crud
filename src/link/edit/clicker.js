import { getView } from '@scola/gui';
import { select } from 'd3';
import CrudWorker from '../../worker/crud';

export default class LinkClicker extends CrudWorker {
  act(route, data) {
    route.list.enter
      .filter((datum, index, nodes) => {
        return select(nodes[index]).classed('disabled') === false;
      })
      .on('click', (datum, index) => {
        getView('main').handle({
          dir: datum.dir,
          name: 'view-' + this._link,
          params: {
            id: data[index][this._link + '_id']
          },
          remember: true
        });
      });

    this.pass(route);
  }
}
