import defaultsDeep from 'lodash-es/defaultsDeep';
import filterPermission from '../filter/permission';
import formatString from '../format/string';

export default function routeList(options = {}) {
  options = defaultsDeep({}, options, {
    id: `${options.name}_id`,
    format: options.name,
    permission: `${options.name}.self`
  }, {
    click: `view-${options.name}`,
    header: {
      add: `add-${options.name}`,
      back: 'main',
      del: `delete-${options.name}`
    },
    list: `/api/${options.name}`
  });

  function click(datum, index, nodes, { getView, data }) {
    getView('main').handle({
      back: false,
      name: options.click,
      params: {
        [options.id]: data.data[index][options.id]
      }
    });
  }

  function header(datum, index, nodes, { getView, name, route }) {
    if (name === 'add') {
      getView('main').handle({
        back: false,
        name: options.header.add
      });
    }

    if (name === 'back') {
      getView('menu').handle({
        back: true,
        dir: 'ltr',
        name: options.header.back
      });
    }

    if (name === 'delete') {
      getView('main').handle({
        name: options.header.del,
        params: route.params
      });
    }
  }

  function list(route, data) {
    return {
      method: 'GET',
      url: {
        path: options.list,
        query: data
      }
    };
  }

  return {
    format: formatString(options.format),
    permission: filterPermission(options.permission),
    click: options.click ? click : null,
    header: options.header ? header : null,
    list: options.list ? list : null
  };
}
