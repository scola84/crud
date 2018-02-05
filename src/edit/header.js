import { stringFormat } from '@scola/d3-string-format';
import { GraphicWorker, getView } from '@scola/gui';
import { select } from 'd3';

export default class ObjectHeader extends GraphicWorker {
  act(route, data, callback) {
    const panel = select(route.node)
      .classed('header object', true)
      .classed(route.path.replace('-', ' '), true);

    const header = panel
      .select('.header');

    const center = header
      .select('.center');

    const left = header
      .select('.left');

    const right = header
      .select('.right');

    center
      .append('div')
      .classed('title', true)
      .text(this.format('value.l1.0'));

    left
      .append('button')
      .attr('tabindex', 0)
      .classed('button', true)
      .text(stringFormat('action.panel.button')('cancel'))
      .on('click', (d, i, n) => {
        this.route(d, i, n, { getView, data, name: 'cancel', route });
      });

    right
      .append('button')
      .attr('form', 'form-edit')
      .attr('tabindex', 0)
      .attr('type', 'submit')
      .classed('button', true)
      .text(stringFormat('action.panel.button')('save'));

    this.pass(route, data, callback);
  }
}
