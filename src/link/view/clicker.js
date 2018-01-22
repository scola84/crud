import { getView } from '@scola/gui';
import { event, select } from 'd3';
import CrudWorker from '../../worker/crud';

export default class LinkClicker extends CrudWorker {
  act(route, data) {
    route.list.enter
      .selectAll('.button[tabindex="0"]')
      .on('click', (datum, index) => {
        event.stopPropagation();

        getView('main').handle({
          dir: datum.action === 'view' ? 'rtl' : null,
          name: datum.action + '-' + this._name + '-' + datum.name,
          params: {
            id: route.params.id,
            lid: data[index][this._link + '_id']
          }
        });
      });

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
