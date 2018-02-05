import sprintf from 'sprintf-js';

export default function formatUrl(path, route, data) {
  try {
    path = sprintf.sprintf(path, route.params, data);
  } catch (error) {
    throw new Error('400');
  }

  const url = {
    path
  };

  if (url.path[url.path.length - 1] === '?') {
    url.path = url.path.slice(0, -1);
    url.query = Object.assign({}, route.params, data);
  }

  return url;
}
