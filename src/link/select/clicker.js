import { getView } from '@scola/gui';
import { select } from 'd3';
import CrudWorker from '../../worker/crud';

export default class LinkClicker extends CrudWorker {
  act(route) {
    route.list.empty
      .filter((datum, index, nodes) => {
        return select(nodes[index]).classed('disabled') === false;
      })
      .on('click', () => {
        getView('main').handle({
          name: 'add-' + this._link,
          remember: true
        });
      });

    this.pass(route);
  }
}
