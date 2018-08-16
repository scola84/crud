import { GraphicWorker } from '@scola/gui';
import { select } from 'd3';

const emptyMethods = ['GET', 'OPTIONS'];

export default class Requester extends GraphicWorker {
  act(route, data) {
    route = Object.assign({
      box: route
    }, this.route(route, data));

    if (emptyMethods.indexOf(route.method) === -1) {
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
      const fraction = event && event.lengthComputable ?
        event.loaded / event.total : 1;

      if (fraction === 1) {
        progress
          .select('span')
          .transition()
          .style('width', '100%')
          .on('end', () => progress.remove());
      } else {
        progress
          .select('span')
          .transition()
          .style('width', (fraction * 100) + '%');
      }
    });
  }
}
