import defaults from 'lodash-es/defaults';
import checkFormat from '../internal/check-format';
import checkRoute from '../internal/check-route';
import filterPermission from '../filter/permission';
import formatString from '../format/string';
import handleGui from '../handle/gui';
import handleHttp from '../handle/http';

export default function routeList(options = {}) {
  const names = defaults({}, options.names, {
    id: `${options.names.object}_id`,
    object: options.names.object,
    target: 'main'
  });

  const format = defaults({}, options.format, {
    object: names.object
  });

  const gui = defaults({}, options.gui, {
    add: `add-${names.object}@${names.target}:clear`,
    back: '@self:back;ltr',
    edit: `edit-${names.object}?${names.id}@${names.target}`,
    view: `view-${names.object}?${names.id}@${names.target}:clear`,
    del: `del-${names.object}`
  });

  const http = defaults({}, options.http, {
    list: `GET /api/${names.object}?`
  });

  const permissions = defaults({}, options.permissions, {
    add: `${names.object}.${names.object}.add`,
    del: `${names.object}.${names.object}.del`,
    edit: `${names.object}.${names.object}.edit`,
    list: `${names.object}.${names.object}.list`,
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
    permission: filterPermission(permissions)
  };
}
