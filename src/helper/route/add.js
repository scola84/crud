import defaults from 'lodash-es/defaults';
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

  const gui = defaults({}, options.routes, {
    cancel: `@${names.target}:back`,
    resolve: `edit-${names.object}@${names.target}:back`
  });

  const http = defaults({}, options.routes, {
    add: `POST /api/${names.object}`
  });

  const permissions = defaults({}, options.permissions, {
    add: `${names.object}.${names.object}.add`
  });

  return {
    format: formatString(format),
    gui: handleGui(gui),
    http: handleHttp(http),
    id: names.id,
    permission: filterPermission(permissions)
  };
}
