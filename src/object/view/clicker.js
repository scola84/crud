import { getView } from '@scola/gui';
import CrudWorker from '../../worker/crud';

export default class ObjectClicker extends CrudWorker {
  act(route) {
    route.summary
      .selectAll('.edit button')
      .on('click', () => {
        getView('main').handle({
          name: 'edit-' + this._name,
          params: route.params
        });
      });

    this.pass(route);
  }
}
