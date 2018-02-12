import { GraphicWorker } from '@scola/gui';

export default class Resolver extends GraphicWorker {
  act(route, data) {
    data = this.filter(route, data);
    this.route(null, null, null, { data, name: 'resolve', route });
  }
}
