import defaults from 'lodash-es/defaults';
import filterPermission from '../filter/permission';
import formatString from '../format/string';
import formatUrl from '../format/url';
import handleRoute from '../handle/route';

export default function routeView(options = {}) {
  const names = defaults({}, options, {
    id: `${options.name}_id`,
    format: options.name,
    permission: `${options.name}.self`
  });

  const routes = defaults({}, options, {
    view: `/api/${options.name}/%(${options.name}_id)s`
  });

  function link(datum, index, nodes, { data, name, route }) {
    if (name === 'edit') {
      handleRoute(datum.edit.route, route.params);
    }

    if (name === 'view') {
      const value = data.link[index];

      handleRoute(datum.view.route, {
        [value.name + '_id']: value.id
      });
    }
  }

  function summary(datum, index, nodes, { route }) {
    handleRoute(datum.route, route.params);
  }

  function view(route, data) {
    return {
      method: 'GET',
      url: formatUrl(routes.view, route, data)
    };
  }

  return {
    id: names.id,
    format: formatString(names.format),
    permission: filterPermission(names.permission),
    link,
    summary,
    view: routes.view ? view : null
  };
}
