import { StateRouter, getView } from '@scola/gui';

export default function handleGui(routes = {}) {
  return () => {
    return (datum, index, nodes, { data, name, route }) => {
      let all = routes[name] ||
        datum && datum[name] && datum[name].route ||
        datum && datum.route;

      all = Array.isArray(all) ? all : [all];

      let current = null;

      for (let i = 0; i < all.length; i += 1) {
        current = StateRouter.parseRoute(all[i]);
        const [rawPath, rawParams] = current.path.split('?');

        if (typeof rawParams !== 'undefined') {
          current.params = route.params;
          current.path = rawPath;

          if (rawParams.length) {
            const names = rawParams.split(';');
            const picked = {};

            for (let j = 0; j < names.length; j += 1) {
              picked[names[j]] = route.params[names[j]] ||
                data && data[names[j]];
            }

            current.params = picked;
          }
        }

        getView(current.name).handle(current);
      }
    };
  };
}
