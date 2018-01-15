import { stringFormat } from '@scola/d3-string-format';
import { getView, renderSearch } from '@scola/gui';
import { select } from 'd3';
import CrudWorker from '../../worker/crud';

export default class ListHeader extends CrudWorker {
  act(route, data) {
    const panel = select(route.node)
      .classed('header nav outset list', true)
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
      .text(stringFormat(this._name)('nav.l1.d'));

    left
      .append('button')
      .attr('tabindex', 0)
      .classed('button icon back ion-ios-arrow-back', true)
      .text(stringFormat('action.nav.label')('back'))
      .on('click', () => {
        getView('menu').handle({
          back: true,
          dir: 'ltr',
          name: 'main'
        });
      });

    renderSearch(route, { panel, right });

    right
      .append('button')
      .attr('tabindex', 0)
      .classed('button icon add ion-ios-plus-empty', true)
      .on('click', () => {
        select('body').dispatch('click');
        getView('main').handle({
          back: false,
          name: 'add-' + this._name
        });
      });

    this.pass(route, data);
  }
}
