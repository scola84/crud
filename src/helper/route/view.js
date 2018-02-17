import defaults from 'lodash-es/defaults';
import filterPermission from '../filter/permission';
import formatString from '../format/string';
import handleGui from '../handle/gui';
import handleHttp from '../handle/http';

export default function routeView(options = {}) {
  const names = defaults({}, options.names, {
    id: `${options.names.object}_id`,
    object: options.names.object,
    target: 'main'
  });

  const format = defaults({}, options.format, {
    object: names.object
  });

  const gui = defaults({}, options.gui, {
    back: `@${names.target}:back;ltr`,
  });

  const http = defaults({}, options.http, {
    view: `GET /api/${names.object}/%(${names.object}_id)s`
  });

  const permissions = defaults({}, options.permissions, {
    view: `${names.object}.${names.object}.view`
  });

  return {
    format: formatString(format),
    gui: handleGui(gui),
    http: handleHttp(http),
    id: names.id,
    permission: filterPermission(permissions)
  };
}
