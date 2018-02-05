import { StateRouter } from '@scola/gui';
import defaults from 'lodash-es/defaults';
import filterPermission from '../filter/permission';
import formatString from '../format/string';
import formatUrl from '../format/url';

export default function routeEdit(options = {}) {
  const names = defaults({}, options, {
    id: `${options.name}_id`,
    format: options.name,
    permission: `${options.name}.self`,
    target: 'main'
  });

  const routes = defaults({}, options, {
    odel: `/api/${options.name}/%(${names.id})s`,
    edit: `/api/${options.name}/%(${names.id})s`,
    header: {
      cancel: `view-${options.name}@${names.target}:back`
    },
    resolve: `view-${options.name}@${names.target}:back`,
    view: `/api/${options.name}/%(${names.id})s`,
  });

  function odel(route, data) {
    return {
      method: 'DELETE',
      url: formatUrl(routes.odel, route, data)
    };
  }

  function view(route, data) {
    return {
      method: 'GET',
      url: formatUrl(routes.view, route, data)
    };
  }

  function header(datum, index, nodes, { getView, name, route }) {
    const goto = StateRouter.parseRoute(routes.header[name],
      route.params);

    getView(goto.name).handle(goto);
  }

  function edit(route, data) {
    return {
      method: 'PUT',
      url: formatUrl(routes.edit, route, data)
    };
  }

  function resolve(datum, index, nodes, { getView, route }) {
    const parts = Array.isArray(routes.resolve) ?
      routes.resolve : [routes.resolve];

    let goto = null;

    for (let i = 0; i < parts.length; i += 1) {
      goto = StateRouter.parseRoute(parts[i], route.params);
      getView(goto.name).handle(goto);
    }
  }

  return {
    format: formatString(names.format),
    permission: filterPermission(names.permission),
    odel: routes.odel ? odel : null,
    edit: routes.edit ? edit : null,
    header: routes.header ? header : null,
    resolve: routes.resolve ? resolve : null,
    view: routes.view ? view : null
  };
}
