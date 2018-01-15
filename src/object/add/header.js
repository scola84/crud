import { stringFormat } from '@scola/d3-string-format';
import { select } from 'd3';
import CrudWorker from '../../worker/crud';

export default class ObjectHeader extends CrudWorker {
  act(route, data = {}) {
    const panel = select(route.node)
      .classed('header object add', true)
      .classed(this._name, true);

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
      .text(stringFormat(this._name)('nav.l1.0'));

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
      .text(stringFormat('action.nav.label')('add'));

    this.pass(route, data);
  }
}
