import defaults from 'lodash-es/defaults';
import filterPermission from '../filter/permission';
import formatString from '../format/string';
import formatUrl from '../format/url';
import handleRoute from '../handle/route';

export default function routeEdit(options = {}) {
  const names = defaults({}, options, {
    id: `${options.name}_id`,
    format: options.name,
    permission: `${options.name}.self`,
    target: 'main'
  });

  const routes = defaults({}, options, {
    del: `/api/${options.name}/%(${names.id})s`,
    edit: `/api/${options.name}/%(${names.id})s`,
    header: {
      cancel: `view-${options.name}?@${names.target}:back`,
      done: `view-${options.name}@${names.target}:back`
    },
    resolve: `view-${options.name}?@${names.target}:back`,
    view: `/api/${options.name}/%(${names.id})s`,
  });

  function del(route, data) {
    return {
      method: 'DELETE',
      url: formatUrl(routes.del, route, data)
    };
  }

  function view(route, data) {
    return {
      method: 'GET',
      url: formatUrl(routes.view, route, data)
    };
  }

  function header(datum, index, nodes, { name, route }) {
    handleRoute(routes.header[name], route.params);
  }

  function edit(route, data) {
    return {
      method: 'PUT',
      url: formatUrl(routes.edit, route, data)
    };
  }

  function resolve(datum, index, nodes, { route }) {
    handleRoute(routes.resolve, route.params);
  }

  return {
    id: names.id,
    format: formatString(names.format),
    permission: filterPermission(names.permission),
    del: routes.del ? del : null,
    edit: routes.edit ? edit : null,
    header: routes.header ? header : null,
    resolve: routes.resolve ? resolve : null,
    view: routes.view ? view : null
  };
}
