import { getView } from '@scola/gui';
import CrudWorker from '../../worker/crud';

export default class ObjectResolver extends CrudWorker {
  act(route, data) {
    getView('main').handle({
      back: true,
      name: 'edit-' + this._name,
      params: {
        id: data[this._id]
      }
    });
  }
}
