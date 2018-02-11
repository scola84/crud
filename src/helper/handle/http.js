import sprintf from 'sprintf-js';

export default function handleHttp(routes) {
  return (name) => {
    return (route, data) => {
      const [method, path] = routes[name].split(' ');
      const url = {};

      try {
        url.path = sprintf.sprintf(path, route.params, data);
      } catch (error) {
        throw new Error('400');
      }

      if (url.path[url.path.length - 1] === '?') {
        url.path = url.path.slice(0, -1);
        url.query = Object.assign({}, route.params, data);
      }

      return {
        method,
        url
      };
    };
  };
}
