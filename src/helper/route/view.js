import defaultsDeep from 'lodash-es/defaultsDeep';
import filterPermission from '../filter/permission';
import formatString from '../format/string';
import formatUrl from '../format/url';
import handleRoute from '../handle/route';

export default function routeView(options = {}) {
  const names = defaultsDeep({}, options.names, {
    id: `${options.names.name}_id`,
    format: options.names.name,
    name: options.names.name
  });

  const permissions = defaultsDeep({}, options.permissions, {
    view: `${names.name}.self.view`
  });

  const routes = defaultsDeep({}, options.routes, {
    view: `/api/${names.name}/%(${names.name}_id)s`
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
    link,
    permission: filterPermission(permissions),
    summary,
    view: routes.view ? view : null
  };
}
