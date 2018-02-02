import defaults from 'lodash-es/defaults';

export default function routeAdd(routes = {}) {
  routes = defaults({}, routes, {
    id: `${routes.name}_id`,
    poster: `/api/${routes.name}`,
    resolver: `edit-${routes.name}`
  });

  return {
    poster() {
      return {
        method: 'POST',
        url: {
          path: routes.poster
        }
      };
    },
    resolver(d, i, n, { getView, data }) {
      getView('main').handle({
        back: true,
        name: routes.resolver,
        params: {
          [routes.id]: data.id
        }
      });
    }
  };
}
