import defaultsDeep from 'lodash-es/defaultsDeep';
import filterPermission from '../filter/permission';
import formatString from '../format/string';
import formatUrl from '../format/url';
import handleRoute from '../handle/route';

export default function routeList(options = {}) {
  const names = defaultsDeep({}, options.names, {
    id: `${options.names.name}_id`,
    format: options.names.name,
    name: options.names.name,
    target: 'main'
  });

  const permissions = defaultsDeep({}, options.permissions, {
    add: `${names.name}.self.add`,
    del: `${names.name}.self.del`,
    list: `${names.name}.self.list`,
    view: `${names.name}.self.view`
  });

  const routes = defaultsDeep({}, options.routes, {
    add: `add-${names.name}@${names.target}:clear`,
    back: 'main@menu:back;ltr',
    click: `view-${names.name}?@${names.target}:clear`,
    del: `del-${names.name}`,
    list: `/api/${names.name}?`
  });

  function click(datum, index, nodes, { data }) {
    handleRoute(routes.click, {
      [names.id]: data.data[index][names.id]
    });
  }

  function header(datum, index, nodes, { name, route }) {
    handleRoute(routes[name], route.params);
  }

  function list(route, data) {
    return {
      method: 'GET',
      url: formatUrl(routes.list, route, data)
    };
  }

  return {
    click: routes.click ? click : null,
    format: formatString(names.format),
    header,
    id: names.id,
    list: routes.list ? list : null,
    permission: filterPermission(permissions)
  };
}
