import { stringFormat } from '@scola/d3-string-format';
import { getView } from '@scola/gui';
import { select } from 'd3';
import CrudWorker from '../../worker/crud';

export default class LinkHeader extends CrudWorker {
  act(route, data = {}) {
    const panel = select(route.node)
      .classed('header link view', true)
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
      .text(stringFormat(this._link)('nav.l1.d'));

    left
      .append('button')
      .attr('tabindex', 0)
      .classed('button icon ion-ios-arrow-back', true)
      .text(stringFormat('action.nav.label')('back'))
      .on('click', () => {
        getView('main').handle({
          back: true,
          dir: 'ltr',
          name: 'view-' + this._name,
          params: route.params
        });
      });

    right
      .append('button')
      .attr('tabindex', 0)
      .classed('button icon ion-ios-trash-outline', true)
      .on('click', () => {
        getView('main').handle({
          name: 'delete-' + this._name + '-' + this._link,
          params: route.params
        });
      });

    right
      .append('button')
      .attr('tabindex', 0)
      .classed('button icon ion-ios-plus-empty', true)
      .on('click', () => {
        getView('main').handle({
          name: 'add-' + this._name + '-' + this._link,
          params: route.params
        });
      });

    this.pass(route, data);
  }
}
