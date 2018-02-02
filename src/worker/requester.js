import { GraphicWorker } from '@scola/gui';

export default class Requester extends GraphicWorker {
  act(route, data) {
    route = Object.assign({
      box: route
    }, this.route(null, null, null, { data, route }));

    if (route.method !== 'GET' && route.headers) {
      Object.assign(route.headers, {
        'Content-Type': 'application/json'
      });
    }

    this.pass(route, data);
  }
}
