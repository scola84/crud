import defaults from 'lodash-es/defaults';
import sprintf from 'sprintf-js';
import filterPermission from '../filter/permission';
import formatString from '../format/string';

export default function routeView(options = {}) {
  options = defaults({}, options, {
    id: `${options.name}_id`,
    format: options.name,
    permission: `${options.name}.self`
  }, {
    view: `/api/${options.name}/%s`
  });

  function link(datum, index, nodes, { getView, data, name, route }) {
    if (name === 'edit') {
      getView('main').handle({
        dir: datum.edit.dir,
        name: datum.edit.route,
        params: route.params
      });
    }

    if (name === 'view') {
      const value = data.link[index];

      getView('main').handle({
        dir: 'rtl',
        name: datum.view.route,
        params: {
          [value.name + '_id']: value.id
        },
        remember: true
      });
    }
  }

  function summary(datum, index, nodes, { getView, route }) {
    getView('main').handle({
      name: datum.route,
      params: route.params
    });
  }

  function view(route) {
    return {
      method: 'GET',
      url: {
        path: sprintf.sprintf(options.view, route.params[options.id])
      }
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
