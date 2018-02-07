import defaultsDeep from 'lodash-es/defaultsDeep';
import filterPermission from '../filter/permission';
import formatString from '../format/string';
import formatUrl from '../format/url';
import handleRoute from '../handle/route';

export default function routeSelect(options = {}) {
  const names = defaultsDeep({}, options, {
    format: options.list,
    method: 'PUT',
    permission: `${options.object}.self`,
    target: 'main'
  });

  const routes = defaultsDeep({}, options, {
    click: `add-${options.list}@${names.target}:remember,rtl`,
    header: {
      cancel: `view-${options.name}?@${names.target}:back`
    },
    resolve: `view-${options.name}?@${names.target}:back`,
    select: `/api/${options.list}?`,
    send: `/api/${options.object}`,
    view: `/api/${options.object}`
  });

  function click() {
    handleRoute(routes.click);
  }

  function header(datum, index, nodes, { name, route }) {
    handleRoute(routes.header[name], route.params);
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
    id: names.id,
    format: formatString(names.format),
    permission: filterPermission(names.permission),
    click: routes.click ? click : null,
    header: routes.header ? header : null,
    resolve: routes.resolve ? resolve : null,
    select: routes.select ? select : null,
    send: routes.send ? send : null,
    view: routes.view ? view : null
  };
}
