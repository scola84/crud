import sprintf from 'sprintf-js';

export default function handleHttp(routes = {}) {
  return (name) => {
    return (route, data) => {
      let method = null;
      let path = null;
      let query = null;

      if (typeof routes[name] === 'string') {
        [method, path] = routes[name].split(' ');
        query = path[path.length - 1] === '?' ? {} : null;
        path = query ? path.slice(0, -1) : path;
      } else {
        ({ method, url: { path, query } } = routes[name]);
      }

      try {
        path = sprintf.sprintf(path, route.params, data);
      } catch (error) {
        throw new Error(`400 ${error.message}`);
      }

      if (query) {
        query = Object.assign({}, route.params, query, data);
      }

      return {
        method,
        url: {
          path,
          query
        }
      };
    };
  };
}
