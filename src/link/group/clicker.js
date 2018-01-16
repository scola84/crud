import { getView } from '@scola/gui';
import { event, select } from 'd3';
import CrudWorker from '../../worker/crud';

export default class LinkClicker extends CrudWorker {
  act(route, data) {
    const enter = route.nav.enter;

    enter
      .selectAll('.button[tabindex="0"]')
      .on('click', (datum) => {
        event.stopPropagation();

        getView('main').handle({
          dir: datum.action === 'view' ? 'rtl' : null,
          name: datum.action + '-' + this._name + '-' + datum.name,
          params: route.params
        });
      });

    enter
      .filter((datum, index, nodes) => {
        return select(nodes[index]).classed('disabled') === false;
      })
      .on('click', (datum) => {
        getView('main').handle({
          dir: 'rtl',
          name: 'view-' + datum.name,
          params: {
            id: data[datum.name][datum.name + '_id']
          },
          remember: true
        });
      });

    this.pass(route);
  }
}
