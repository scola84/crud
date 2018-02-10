import defaultsDeep from 'lodash-es/defaultsDeep';
import filterPermission from '../filter/permission';
import formatString from '../format/string';
import formatUrl from '../format/url';
import handleRoute from '../handle/route';

export default function routeSelect(options = {}) {
  const names = defaultsDeep({}, options.names, {
    id: `${options.names.name}_id`,
    format: options.names.list,
    list: options.names.list,
    name: options.names.name,
    object: options.names.object,
    method: 'PUT',
    target: 'main'
  });

  const permissions = defaultsDeep({}, options.permissions, {
    select: `${names.object}.self.edit`
  });

  const routes = defaultsDeep({}, options.routes, {
    cancel: `view-${names.name}?@${names.target}:back`,
    click: `add-${names.list}@${names.target}:remember`,
    resolve: `view-${names.name}?@${names.target}:back`,
    select: `/api/${names.list}?`,
    send: `/api/${names.object}`,
    view: `/api/${names.object}`
  });

  function click() {
    handleRoute(routes.click);
  }

  function header(datum, index, nodes, { name, route }) {
    handleRoute(routes[name], route.params);
  }

  function resolve(datum, index, nodes, { route }) {
    handleRoute(routes.resolve, route.params);
  }

  function select(route, data) {
    return {
      method: 'GET',
      url: formatUrl(routes.select, route, data)
    };
  }

  function send(route, data) {
    return {
      method: names.method,
      url: formatUrl(routes.send, route, data)
    };
  }

  function view(route, data) {
    return {
      method: 'GET',
      url: formatUrl(routes.view, route, data)
    };
  }

  return {
    click: routes.click ? click : null,
    format: formatString(names.format),
    header,
    id: names.id,
    permission: filterPermission(permissions),
    resolve: routes.resolve ? resolve : null,
    select: routes.select ? select : null,
    send: routes.send ? send : null,
    view: routes.view ? view : null
  };
}
