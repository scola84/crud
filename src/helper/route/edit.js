import defaults from 'lodash-es/defaults';
import sprintf from 'sprintf-js';
import filterPermission from '../filter/permission';
import formatString from '../format/string';

export default function routeEdit(options = {}) {
  options = defaults({}, options, {
    id: `${options.name}_id`,
    format: options.name,
    permission: `${options.name}.self`
  }, {
    del: `/api/${options.name}`,
    edit: `/api/${options.name}/%s`,
    header: {
      cancel: `view-${options.name}`
    },
    resolve: `view-${options.name}`,
    view: `/api/${options.name}/%s`
  });

  function del() {
    return {
      method: 'DELETE',
      url: {
        path: options.del
      }
    };
  }

  function view(route) {
    return {
      method: 'GET',
      url: {
        path: sprintf.sprintf(options.view, route.params[options.id])
      }
    };
  }

  function header(datum, index, nodes, { getView, name, route }) {
    if (name === 'cancel') {
      getView('main').handle({
        back: true,
        name: options.header.cancel,
        params: route.params
      });
    }
  }

  function edit(route) {
    return {
      method: 'PUT',
      url: {
        path: sprintf.sprintf(options.edit, route.params[options.id])
      }
    };
  }

  function resolve(datum, index, nodes, { getView, route }) {
    getView('main').handle({
      back: true,
      name: options.resolve,
      params: route.params
    });
  }

  return {
    format: formatString(options.format),
    permission: filterPermission(options.permission),
    del: options.del ? del : null,
    edit: options.edit ? edit : null,
    header: options.header ? header : null,
    resolve: options.resolve ? resolve : null,
    view: options.view ? view : null
  };
}
