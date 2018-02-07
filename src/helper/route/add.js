import defaults from 'lodash-es/defaults';
import filterPermission from '../filter/permission';
import formatString from '../format/string';
import formatUrl from '../format/url';
import handleRoute from '../handle/route';

export default function routeAdd(options = {}) {
  const names = defaults({}, options, {
    id: `${options.name}_id`,
    format: options.name,
    permission: `${options.name}.self`,
    target: 'main'
  });

  const routes = defaults({}, options, {
    add: `/api/${options.name}`,
    resolve: `edit-${options.name}@${names.target}:back`
  });

  function add(route, data) {
    return {
      method: 'POST',
      url: formatUrl(routes.add, route, data)
    };
  }

  function resolve(datum, index, nodes, { data }) {
    handleRoute(routes.resolve, {
      [names.id]: data.data.id
    });
  }

  return {
    id: names.id,
    format: formatString(names.format),
    permission: filterPermission(names.permission),
    add: routes.add ? add : null,
    resolve: routes.resolve ? resolve : null
  };
}
