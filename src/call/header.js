import { stringFormat } from '@scola/d3-string-format';

import {
  GraphicWorker,
  renderBack
} from '@scola/gui';

import { select } from 'd3';

export default class CallHeader extends GraphicWorker {
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
      .text(this.format('title.l1.0'));

    renderBack(route, { icon: true, left }, (d, i, n) => {
      this.route(d, i, n, { data, name: 'back', route });
    });

    right
      .append('button')
      .attr('form', 'form-call')
      .attr('tabindex', 0)
      .attr('type', 'submit')
      .classed('button right', true)
      .text(stringFormat('action.panel.button')('call'));

    this.pass(route, data, callback);
  }
}
