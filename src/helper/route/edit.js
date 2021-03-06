import defaults from 'lodash-es/defaults';
import checkFormat from '../internal/check-format';
import checkRoute from '../internal/check-route';
import filterPermission from '../filter/permission';
import formatString from '../format/string';
import handleGui from '../handle/gui';
import handleHttp from '../handle/http';

export default function routeEdit(options = {}) {
  const names = defaults({}, options.names, {
    id: `${options.names.object}_id`,
    object: options.names.object,
    target: 'main'
  });

  const format = defaults({}, options.format, {
    object: names.object
  });

  const gui = defaults({}, options.gui, {
    cancel: `view-${names.object}?@${names.target}:back`,
    done: `view-${names.object}@${names.target}:back`,
    resolve: `view-${names.object}?@${names.target}:back`,
  });

  const http = defaults({}, options.http, {
    del: `DELETE /api/${names.object}/%(${names.id})s`,
    edit: `PUT /api/${names.object}/%(${names.id})s`,
    view: `GET /api/${names.object}/%(${names.id})s?link[omit]=*`
  });

  const permissions = defaults({}, options.permissions, {
    del: `${names.object}.${names.object}.del`,
    edit: `${names.object}.${names.object}.edit`,
    view: `${names.object}.${names.object}.view`
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
    permission: filterPermission(permissions),
  };
}
