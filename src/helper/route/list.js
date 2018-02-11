import defaults from 'lodash-es/defaults';
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

  const permissions = defaults({}, options.permissions, {
    add: `${names.object}.${names.object}.add`,
    del: `${names.object}.${names.object}.del`,
    edit: `${names.object}.${names.object}.edit`,
    list: `${names.object}.${names.object}.list`,
    view: `${names.object}.${names.object}.view`
  });

  const gui = defaults({}, options.gui, {
    add: `add-${names.object}@${names.target}:clear`,
    back: 'main@menu:back;ltr',
    edit: `edit-${names.object}?${names.id}@${names.target}`,
    view: `view-${names.object}?${names.id}@${names.target}:clear`,
    del: `del-${names.object}`
  });

  const http = defaults({}, options.http, {
    list: `GET /api/${names.object}?`
  });

  return {
    format: formatString(format),
    gui: handleGui(gui),
    http: handleHttp(http),
    id: names.id,
    permission: filterPermission(permissions)
  };
}
