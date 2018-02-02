import { GraphicWorker, getView } from '@scola/gui';

export default class Resolver extends GraphicWorker {
  act(route, data) {
    this.route(null, null, null, { getView, data, route });
  }
}
