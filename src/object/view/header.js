import { stringFormat } from '@scola/d3-string-format';
import { renderBack, getView } from '@scola/gui';
import { select } from 'd3';
import CrudWorker from '../../worker/crud';

export default class ObjectHeader extends CrudWorker {
  act(route, data = {}) {
    const panel = select(route.node)
      .classed('header object view', true)
      .classed(this._name, true);

    const header = panel
      .select('.header');

    const center = header
      .select('.center');

    const left = header
      .select('.left');

    center
      .append('div')
      .classed('title', true)
      .text(stringFormat(this._name)('nav.l1.0'));

    const text = stringFormat('action.nav.label')('back');

    renderBack(route, { icon: true, left, text }, () => {
      getView('main').handle({
        back: true,
        dir: 'ltr'
      });
    });

    this.pass(route, data);
  }
}
