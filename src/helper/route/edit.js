import defaultsDeep from 'lodash-es/defaultsDeep';
import filterPermission from '../filter/permission';
import formatString from '../format/string';
import formatUrl from '../format/url';
import handleRoute from '../handle/route';

export default function routeEdit(options = {}) {
  const names = defaultsDeep({}, options.names, {
    id: `${options.names.name}_id`,
    format: options.names.name,
    name: options.names.name,
    target: 'main'
  });

  const permissions = defaultsDeep({}, options.permissions, {
    del: `${names.name}.self.del`,
    edit: `${names.name}.self.edit`,
    view: `${names.name}.self.view`
  });

  const routes = defaultsDeep({}, options.routes, {
    del: `/api/${names.name}/%(${names.id})s`,
    edit: `/api/${names.name}/%(${names.id})s`,
    cancel: `view-${names.name}?@${names.target}:back`,
    done: `view-${names.name}@${names.target}:back`,
    resolve: `view-${names.name}?@${names.target}:back`,
    view: `/api/${names.name}/%(${names.id})s`,
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
    handleRoute(routes[name], route.params);
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
    del: routes.del ? del : null,
    edit: routes.edit ? edit : null,
    format: formatString(names.format),
    header,
    id: names.id,
    permission: filterPermission(permissions),
    resolve: routes.resolve ? resolve : null,
    view: routes.view ? view : null
  };
}
