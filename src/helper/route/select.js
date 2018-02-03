import defaults from 'lodash-es/defaults';
import filterPermission from '../filter/permission';
import formatString from '../format/string';

export default function routeSelect(options = {}) {
  options = defaults({}, options, {
    format: options.source,
    method: 'PUT',
    permission: `${options.target}.self`
  }, {
    check: `/api/${options.target}`,
    click: `add-${options.source}`,
    edit: `/api/${options.name}`,
    header: {
      cancel: `view-${options.name}`
    },
    resolve: `view-${options.name}`,
    select: `/api/${options.source}`,
    send: `/api/${options.target}`
  });

  function check(route) {
    return {
      method: 'GET',
      url: {
        path: options.check,
        query: route.params
      }
    };
  }

  function click(datum, index, nodes, { getView }) {
    getView('main').handle({
      name: options.click,
      remember: true
    });
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

  function resolve(datum, index, nodes, { getView, route }) {
    getView('main').handle({
      back: true,
      name: options.resolve,
      params: route.params
    });
  }

  function select(route, data) {
    return {
      method: 'GET',
      url: {
        path: options.select,
        query: data
      }
    };
  }

  function send() {
    return {
      method: options.method,
      url: {
        path: options.send
      }
    };
  }

  return {
    format: formatString(options.format),
    permission: filterPermission(options.permission),
    check: options.check ? check : null,
    click: options.click ? click : null,
    header: options.header ? header : null,
    resolve: options.resolve ? resolve : null,
    select: options.select ? select : null,
    send: options.send ? send : null
  };
}
