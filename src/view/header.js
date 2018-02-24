import { stringFormat } from '@scola/d3-string-format';

import {
  GraphicWorker,
  renderBack
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

    const text = stringFormat('action.panel.button')('back');

    renderBack(route, { icon: true, left, text }, (d, i, n) => {
      this.route(d, i, n, { data, name: 'back', route });
    });

    right
      .selectAll('button')
      .data(this._structure || [])
      .enter()
      .append('button')
      .attr('class', (datum) => 'button icon ' + datum.button)
      .on('click', (d, i, n) => {
        this.route(d, i, n, { data, route });
      });

    this.pass(route, data, callback);
  }
}
