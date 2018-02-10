import { stringFormat } from '@scola/d3-string-format';

import {
  GraphicWorker,
  renderCancel
} from '@scola/gui';

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
      .text(this.format('title.l1.0'));

    const text = stringFormat('action.panel.button')('cancel');

    renderCancel(route, { icon: true, left, text }, (d, i, n) => {
      this.route(d, i, n, { data, name: 'cancel', route });
    });

    left
      .append('button')
      .attr('tabindex', 0)
      .classed('button left show-menu ion-navicon', true);

    right
      .append('button')
      .attr('form', 'form-add')
      .attr('tabindex', 0)
      .attr('type', 'submit')
      .classed('button right', true)
      .text(stringFormat('action.panel.button')('add'));

    this.pass(route, data, callback);
  }
}
