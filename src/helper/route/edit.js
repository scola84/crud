import defaults from 'lodash-es/defaults';
import sprintf from 'sprintf-js';

export default function routeEdit(routes = {}) {
  routes = defaults({}, routes, {
    id: `${routes.name}_id`,
    deleter: `/api/${routes.name}`,
    getter: `/api/${routes.name}/%s`,
    header: `view-${routes.name}`,
    putter: `/api/${routes.name}/%s`,
    resolver: `view-${routes.name}`
  });

  return {
    deleter() {
      return {
        method: 'DELETE',
        url: {
          path: routes.deleter
        }
      };
    },
    getter(d, i, n, { route }) {
      return {
        method: 'GET',
        url: {
          path: sprintf.sprintf(routes.getter, route.params[routes.id])
        }
      };
    },
    header(d, i, n, { getView, route }) {
      getView('main').handle({
        back: true,
        name: routes.header,
        params: route.params
      });
    },
    putter(d, i, n, { route }) {
      return {
        method: 'PUT',
        url: {
          path: sprintf.sprintf(routes.putter, route.params[routes.id])
        }
      };
    },
    resolver(d, i, n, { getView, route }) {
      getView('main').handle({
        back: true,
        name: routes.resolver,
        params: route.params
      });
    }
  };
}
