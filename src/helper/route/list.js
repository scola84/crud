import defaultsDeep from 'lodash-es/defaultsDeep';
import filterPermission from '../filter/permission';
import formatString from '../format/string';
import formatUrl from '../format/url';
import handleRoute from '../handle/route';

export default function routeList(options = {}) {
  const names = defaultsDeep({}, options, {
    id: `${options.name}_id`,
    format: options.name,
    permission: `${options.name}.self`,
    target: 'main'
  });

  const routes = defaultsDeep({}, options, {
    click: `view-${options.name}?@${names.target}:clear`,
    header: {
      add: `add-${options.name}@${names.target}:clear`,
      back: 'main@menu:back;ltr',
      del: `delete-${options.name}`
    },
    list: `/api/${options.name}?`
  });

  function click(datum, index, nodes, { data }) {
    handleRoute(routes.click, {
      [names.id]: data.data[index][names.id]
    });
  }

  function header(datum, index, nodes, { name, route }) {
    handleRoute(routes.header[name], route.params);
  }

  function list(route, data) {
    return {
      method: 'GET',
      url: formatUrl(routes.list, route, data)
    };
  }

  return {
    id: names.id,
    format: formatString(names.format),
    permission: filterPermission(names.permission),
    click: routes.click ? click : null,
    header: routes.header ? header : null,
    list: routes.list ? list : null
  };
}
