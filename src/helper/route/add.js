import defaults from 'lodash-es/defaults';
import checkFormat from '../internal/check-format';
import checkRoute from '../internal/check-route';
import filterPermission from '../filter/permission';
import formatString from '../format/string';
import handleGui from '../handle/gui';
import handleHttp from '../handle/http';

export default function routeAdd(options = {}) {
  const names = defaults({}, options.names, {
    id: `${options.names.object}_id`,
    object: options.names.object,
    target: 'main'
  });

  const format = defaults({}, options.format, {
    object: names.object
  });

  const gui = defaults({}, options.gui, {
    cancel: `@${names.target}:back`,
    resolve: `view-${names.object}?${names.id}@${names.target}:back`
  });

  const http = defaults({}, options.http, {
    add: `POST /api/${names.object}`
  });

  const permissions = defaults({}, options.permissions, {
    add: `${names.object}.${names.object}.add`
  });

  checkFormat(format.object, options);
  checkRoute(gui, options);
  checkRoute(http, options);
  checkRoute(permissions, options);

  return {
    format: formatString(format),
    gui: handleGui(gui),
    http: handleHttp(http),
    id: names.id,
    options: http.options ? true : false,
    permission: filterPermission(permissions)
  };
}
