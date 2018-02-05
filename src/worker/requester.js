import { GraphicWorker } from '@scola/gui';

export default class Requester extends GraphicWorker {
  act(route, data, callback) {
    route = Object.assign({
      box: route
    }, this.route(route, data));

    if (route.method !== 'GET') {
      route.headers = Object.assign({
        'Content-Type': 'application/json'
      }, route.headers);
    }

    this.pass(route, data, callback);
  }
}
