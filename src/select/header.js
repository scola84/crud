import { stringFormat } from '@scola/d3-string-format';
import { GraphicWorker } from '@scola/gui';
import { select } from 'd3';

export default class SelectHeader extends GraphicWorker {
  constructor(options = {}) {
    super(options);

    this._search = null;
    this.setSearch(options.search);
  }

  setSearch(value = null) {
    this._search = value;
    return this;
  }

  act(route, data, callback) {
    const [action] = route.path.split('-');

    const panel = select(route.node)
      .classed('header outset select', true)
      .classed('show-search immediate', this._search !== false)
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
      .classed('button', true)
      .text(stringFormat('action.panel.button')('cancel'))
      .on('click', (d, i, n) => {
        this.route(d, i, n, { data, name: 'cancel', route });
      });

    right
      .append('button')
      .attr('form', 'form-select')
      .attr('tabindex', 0)
      .attr('type', 'submit')
      .classed('button', true)
      .text(stringFormat('action.panel.button')(action));

    this.pass(route, data, callback);
  }
}
