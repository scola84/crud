import defaultsDeep from 'lodash-es/defaultsDeep';
import filterPermission from '../filter/permission';
import formatString from '../format/string';
import formatUrl from '../format/url';
import handleRoute from '../handle/route';

export default function routeAdd(options = {}) {
  const names = defaultsDeep({}, options.names, {
    id: `${options.names.name}_id`,
    format: options.names.name,
    name: options.names.name,
    target: 'main'
  });

  const permissions = defaultsDeep({}, options.permissions, {
    add: `${names.name}.self.add`
  });

  const routes = defaultsDeep({}, options.routes, {
    add: `/api/${names.name}`,
    cancel: `@${names.target}:back`,
    resolve: `edit-${names.name}@${names.target}:back`
  });

  function add(route, data) {
    return {
      method: 'POST',
      url: formatUrl(routes.add, route, data)
    };
  }

  function header(datum, index, nodes, { name, route }) {
    handleRoute(routes[name], route.params);
  }

  function resolve(datum, index, nodes, { data }) {
    handleRoute(routes.resolve, {
      [names.id]: data.data.id
    });
  }

  return {
    add: routes.add ? add : null,
    format: formatString(names.format),
    header,
    id: names.id,
    permission: filterPermission(permissions),
    resolve: routes.resolve ? resolve : null
  };
}
