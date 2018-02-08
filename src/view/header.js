import { stringFormat } from '@scola/d3-string-format';

import {
  GraphicWorker,
  renderBack,
  getView
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

    center
      .append('div')
      .classed('title', true)
      .text(this.format('title.l1.0'));

    const text = stringFormat('action.panel.button')('back');

    renderBack(route, { icon: true, left, text }, () => {
      getView('main').handle({
        back: true,
        ltr: true
      });
    });

    this.pass(route, data, callback);
  }
}
