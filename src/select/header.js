import { stringFormat } from '@scola/d3-string-format';
import { GraphicWorker, getView } from '@scola/gui';
import { select } from 'd3';

export default class SelectHeader extends GraphicWorker {
  act(route, data = {}) {
    const [action] = route.name.split('-');

    const panel = select(route.node)
      .classed('header search', true)
      .classed(route.name.replace('-', ' '), true);

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
      .text(this.format('nav.l1.d'));

    left
      .append('button')
      .attr('tabindex', 0)
      .classed('button', true)
      .text(stringFormat('action.nav.label')('cancel'))
      .on('click', (d, i, n) => {
        this.route(d, i, n, { getView, data, name: 'cancel', route });
      });

    right
      .append('button')
      .attr('form', 'form-select')
      .attr('tabindex', 0)
      .attr('type', 'submit')
      .classed('button', true)
      .text(stringFormat('action.nav.label')(action));

    this.pass(route, data);
  }
}
