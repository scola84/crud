import { getView } from '@scola/gui';
import CrudWorker from '../../worker/crud';

export default class LinkResolver extends CrudWorker {
  act(route) {
    getView('main').handle({
      back: true,
      name: 'view-' + this._name,
      params: {
        id: route.params.id
      }
    });
  }
}
