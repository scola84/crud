import { StateRouter } from '@scola/gui';
import defaultsDeep from 'lodash-es/defaultsDeep';
import filterPermission from '../filter/permission';
import formatString from '../format/string';
import formatUrl from '../format/url';

export default function routeList(options = {}) {
  const names = defaultsDeep({}, options, {
    id: `${options.name}_id`,
    format: options.name,
    permission: `${options.name}.self`,
    target: 'main'
  });

  const routes = defaultsDeep({}, options, {
    click: `view-${options.name}@${names.target}:clear`,
    header: {
      add: `add-${options.name}@${names.target}:clear`,
      back: 'main@menu:back;ltr',
      del: `delete-${options.name}`
    },
    list: `/api/${options.name}?`
  });

  function click(datum, index, nodes, { getView, data }) {
    const goto = StateRouter.parseRoute(routes.click, {
      [names.id]: data.data[index][names.id]
    });

    getView(goto.name).handle(goto);
  }

  function header(datum, index, nodes, { getView, name, route }) {
    const goto = StateRouter.parseRoute(routes.header[name], route.params);
    getView(goto.name).handle(goto);
  }

  function list(route, data) {
    return {
      method: 'GET',
      url: formatUrl(routes.list, route, data)
    };
  }

  return {
    format: formatString(names.format),
    permission: filterPermission(names.permission),
    click: routes.click ? click : null,
    header: routes.header ? header : null,
    list: routes.list ? list : null
  };
}
