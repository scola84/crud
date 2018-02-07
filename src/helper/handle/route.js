import { StateRouter, getView } from '@scola/gui';

export default function formatRoute(routes, params) {
  routes = Array.isArray(routes) ? routes : [routes];

  let route = null;

  for (let i = 0; i < routes.length; i += 1) {
    route = StateRouter.parseRoute(routes[i], params);

    if (route.path[route.path.length - 1] === '?') {
      route.params = params;
      route.path = route.path.slice(0, -1);
    }

    getView(route.name).handle(route);
  }
}
