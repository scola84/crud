import { stringFormat } from '@scola/d3-string-format';

import {
  GraphicWorker,
  renderSearch
} from '@scola/gui';

import { select } from 'd3';

export default class ListHeader extends GraphicWorker {
  constructor(options = {}) {
    super(options);

    this._search = null;
    this.setSearch(options.search);
  }

  setSearch(value = true) {
    this._search = value;
    return this;
  }

  act(route, data, callback) {
    const panel = select(route.node)
      .classed('header outset', true)
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
      .text(this.format('title.l1.d'));

    left
      .append('button')
      .attr('tabindex', 0)
      .classed('button icon back ion-ios-arrow-back', true)
      .text(stringFormat('action.panel.button')('back'))
      .on('click', (d, i, n) => {
        this.route(d, i, n, { data, name: 'back', route });
      });

    if (this._search === true) {
      renderSearch(route, { panel, right });
    }

    right
      .selectAll('button:not(.search)')
      .data(this._structure || [])
      .enter()
      .append('button')
      .attr('class', (datum) => 'button icon ' + datum.button)
      .on('click', (d, i, n) => {
        this.route(d, i, n, { data, route });
      });

    right
      .append('button')
      .attr('tabindex', 0)
      .classed('button icon delete ion-ios-trash-outline', true)
      .on('click', (d, i, n) => {
        this.route(d, i, n, { data, name: 'del', route });
      });

    right
      .append('button')
      .attr('tabindex', 0)
      .classed('button icon add ion-ios-plus-empty', true)
      .on('click', (d, i, n) => {
        select('body').dispatch('click');
        this.route(d, i, n, { data, name: 'add', route });
      });

    this.pass(route, data, callback);
  }
}
