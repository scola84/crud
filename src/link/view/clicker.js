import { getView } from '@scola/gui';
import CrudWorker from '../../worker/crud';

export default class LinkClicker extends CrudWorker {
  act(route, data) {
    route.list.enter
      .selectAll('.button[tabindex="0"]')
      .on('click', (datum) => {
        event.stopPropagation();

        getView('main').handle({
          dir: datum.action === 'view' ? 'rtl' : null,
          name: datum.action + '-' + this._name + '-' + datum.name,
          params: route.params
        });
      });

    route.list.enter
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
