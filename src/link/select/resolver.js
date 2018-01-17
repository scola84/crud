import { getView } from '@scola/gui';
import CrudWorker from '../../worker/crud';

export default class LinkResolver extends CrudWorker {
  act(route) {
    const [action] = route.name.split('-');

    const name = action === 'select' ?
      'view-' + this._name :
      'view-' + this._name + '-' + this._link;

    getView('main').handle({
      back: true,
      name,
      params: route.params
    });
  }
}
