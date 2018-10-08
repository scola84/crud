import defaults from 'lodash-es/defaults';
import checkFormat from '../internal/check-format';
import checkRoute from '../internal/check-route';
import filterPermission from '../filter/permission';
import formatString from '../format/string';
import handleHttp from '../handle/http';

export default function routeCall(options = {}) {
  const names = defaults({}, options.names, {
    call: options.names.call,
    target: 'main'
  });

  const format = defaults({}, options.format, {
    call: names.call
  });

  const http = defaults({}, options.http, {
    call: `POST /rpc/${names.call}`
  });

  const permissions = defaults({}, options.permissions, {
    call: `${names.call}.${names.call}.call`
  });

  checkFormat(format.call, options);
  checkRoute(http, options);
  checkRoute(permissions, options);

  return {
    format: formatString(format),
    http: handleHttp(http),
    id: names.id,
    options: http.options ? true : false,
    permission: filterPermission(permissions)
  };
}
