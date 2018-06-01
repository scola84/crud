import {
  StateRouter,
  getView,
  requestResource
} from '@scola/gui';

function handleView(datum, index, nodes, data, name, route, routes) {
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

        let sourceName = null;
        let targetName = null;

        for (let j = 0; j < names.length; j += 1) {
          [targetName, sourceName] = names[j].split('=');
          sourceName = sourceName || targetName;

          picked[targetName] = route.params[sourceName] ||
            data && data[sourceName];
        }

        current.params = picked;
      }
    }

    getView(current.name).handle(current);
  }
}

export default function handleGui(routes = {}) {
  return () => {
    return (datum, index, nodes, { data, name, route }) => {
      if (datum && typeof datum.request !== 'undefined') {
        const [box, requestData, callback] = datum
          .request(datum, index, nodes, { data, name, route });

        if (box) {
          box.datum = datum;
          box.node = box.node || nodes[index];
          requestResource(box, requestData, callback);
        }

        return;
      }

      handleView(datum, index, nodes, data, name, route, routes);
    };
  };
}
