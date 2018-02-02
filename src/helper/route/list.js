import defaults from 'lodash-es/defaults';

export default function routeList(routes = {}) {
  routes = defaults({}, routes, {
    id: `${routes.name}_id`,
    clicker: `view-${routes.name}`,
    getter: `/api/${routes.name}`,
    header_add: `add-${routes.name}`,
    header_delete: `delete-${routes.name}`
  });

  return {
    clicker(datum, index, nodes, { getView, data }) {
      getView('main').handle({
        back: false,
        name: routes.clicker,
        params: {
          [routes.id]: data.data[index][routes.id]
        }
      });
    },
    getter(d, i, n, { data }) {
      return {
        method: 'GET',
        url: {
          path: routes.getter,
          query: data
        }
      };
    },
    header(d, i, n, { getView, name, route }) {
      if (name === 'add') {
        getView('main').handle({
          back: false,
          name: routes.header_add
        });
      }

      if (name === 'back') {
        getView('menu').handle({
          back: true,
          dir: 'ltr',
          name: 'main'
        });
      }

      if (name === 'delete') {
        getView('main').handle({
          name: routes.header_delete,
          params: route.params
        });
      }
    }
  };
}
