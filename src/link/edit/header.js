import { stringFormat } from '@scola/d3-string-format';
import { getView } from '@scola/gui';
import { select } from 'd3';
import CrudWorker from '../../worker/crud';

export default class LinkHeader extends CrudWorker {
  act(route, data = {}) {
    const panel = select(route.node)
      .classed('header link edit', true)
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
      .text(stringFormat(this._link)('nav.l1.0'));

    left
      .append('button')
      .attr('tabindex', 0)
      .classed('button', true)
      .text(stringFormat('action.nav.label')('cancel'))
      .on('click', () => {
        getView('main').handle({
          back: true,
          name: 'view-' + this._name + '-' + this._link,
          params: {
            id: route.params.id
          }
        });
      });

    right
      .append('button')
      .attr('form', 'form-edit-link')
      .attr('tabindex', 0)
      .attr('type', 'submit')
      .classed('button', true)
      .text(stringFormat('action.nav.label')('save'));

    this.pass(route, data);
  }
}
