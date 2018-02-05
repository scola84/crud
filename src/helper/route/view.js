import { StateRouter } from '@scola/gui';
import defaults from 'lodash-es/defaults';
import filterPermission from '../filter/permission';
import formatString from '../format/string';
import formatUrl from '../format/url';

export default function routeView(options = {}) {
  options = defaults({}, options, {
    id: `${options.name}_id`,
    format: options.name,
    permission: `${options.name}.self`
  }, {
    view: `/api/${options.name}/%(${options.name}_id)s`
  });

  function link(datum, index, nodes, { getView, data, name, route }) {
    if (name === 'edit') {
      const goto = StateRouter.parseRoute(datum.edit.route, route.params);
      getView(goto.name).handle(goto);
    }

    if (name === 'view') {
      const value = data.link[index];
      const goto = StateRouter.parseRoute(datum.view.route, {
        [value.name + '_id']: value.id
      });

      getView(goto.name).handle(goto);
    }
  }

  function summary(datum, index, nodes, { getView, route }) {
    const goto = StateRouter.parseRoute(datum.route, route.params);
    getView(goto.name).handle(goto);
  }

  function view(route, data) {
    return {
      method: 'GET',
      url: formatUrl(options.view, route, data)
    };
  }

  return {
    format: formatString(options.format),
    permission: filterPermission(options.permission),
    link,
    summary,
    view: options.view ? view : null
  };
}
