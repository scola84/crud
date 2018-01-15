import { getView } from '@scola/gui';
import { select } from 'd3';
import CrudWorker from '../../worker/crud';

export default class ListClicker extends CrudWorker {
  act(route, data) {
    route.list.enter
      .on('click', (datum, index) => {
        select('body').dispatch('click');

        getView('main').handle({
          back: false,
          name: 'view-' + this._name,
          params: { id: data[index].id }
        });
      });

    this.pass(route, data);
  }
}
