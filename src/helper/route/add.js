import defaults from 'lodash-es/defaults';
import filterPermission from '../filter/permission';
import formatString from '../format/string';

export default function routeAdd(options = {}) {
  options = defaults({}, options, {
    id: `${options.name}_id`,
    format: options.name,
    permission: `${options.name}.self`
  }, {
    add: `/api/${options.name}`,
    resolve: `edit-${options.name}`
  });

  function add() {
    return {
      method: 'POST',
      url: {
        path: options.add
      }
    };
  }

  function resolve(datum, index, nodes, { getView, data }) {
    getView('main').handle({
      back: true,
      name: options.resolve,
      params: {
        [options.id]: data.id
      }
    });
  }

  return {
    format: formatString(options.format),
    permission: filterPermission(options.permission),
    add: options.add ? add : null,
    resolve: options.resolve ? resolve : null
  };
}
