import { GraphicWorker } from '@scola/gui';
import { select } from 'd3';

export default class Requester extends GraphicWorker {
  act(route, data) {
    route = Object.assign({
      box: route
    }, this.route(route, data));

    if (route.method !== 'GET') {
      route.headers = Object.assign({
        'Content-Type': route.box.formData ?
          'multipart/form-data' : 'application/json'
      }, route.headers);
    }

    const progress = select(route.box.node)
      .select('.content')
      .append('div')
      .classed('progress', true);

    progress.append('span');

    this.pass(route, data, (event) => {
      const fraction = event.lengthComputable ?
        event.loaded / event.total : 1;

      if (fraction === 1) {
        progress.remove();
      } else {
        progress
          .select('span')
          .style('width', (fraction * 100) + '%');
      }
    });
  }
}
