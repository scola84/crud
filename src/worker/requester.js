import { GraphicWorker } from '@scola/gui';

export default class Requester extends GraphicWorker {
  act(route, data) {
    route = Object.assign({
      box: route
    }, this.route(route, data));

    if (route.method !== 'GET' && route.headers) {
      Object.assign(route.headers, {
        'Content-Type': 'application/json'
      });
    }

    this.pass(route, data);
  }
}
