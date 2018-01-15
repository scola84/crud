import { getView } from '@scola/gui';
import CrudWorker from '../../worker/crud';

export default class LinkClicker extends CrudWorker {
  act(route, data) {
    route.list.enter
      .on('click', (datum, index) => {
        getView('main').handle({
          dir: datum.dir,
          name: 'view-' + this._link,
          params: {
            id: data[index].id
          },
          remember: true
        });
      });

    this.pass(route);
  }
}
