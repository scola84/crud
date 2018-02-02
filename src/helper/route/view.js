import defaults from 'lodash-es/defaults';
import sprintf from 'sprintf-js';

export default function routeView(routes = {}) {
  routes = defaults({}, routes, {
    id: `${routes.name}_id`,
    getter: `/api/${routes.name}/%s`
  });

  return {
    getter(d, i, n, { route }) {
      return {
        method: 'GET',
        url: {
          path: sprintf.sprintf(routes.getter, route.params[routes.id])
        }
      };
    },
    link(datum, index, nodes, { getView, data, name, route }) {
      if (name === 'edit') {
        getView('main').handle({
          dir: datum.edit.dir,
          name: datum.edit.route,
          params: route.params
        });
      }

      if (name === 'view') {
        const link = data.link[index];

        getView('main').handle({
          dir: 'rtl',
          name: datum.view.route,
          params: {
            [link.name + '_id']: link.id
          },
          remember: true
        });
      }
    },
    summary(datum, index, nodes, { getView, route }) {
      getView('main').handle({
        name: datum.route,
        params: route.params
      });
    }
  };
}
