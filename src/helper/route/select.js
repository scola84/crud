import defaults from 'lodash-es/defaults';
import checkFormat from '../internal/check-format';
import checkRoute from '../internal/check-route';
import filterPermission from '../filter/permission';
import formatString from '../format/string';
import handleGui from '../handle/gui';
import handleHttp from '../handle/http';

const map = {
  DELETE: 'clr',
  POST: 'add',
  PUT: 'edit'
};

export default function routeSelect(options = {}) {
  const names = defaults({}, options.names, {
    id: `${options.names.list}_id`,
    list: options.names.list,
    object: options.names.object,
    target: 'main'
  });

  const format = defaults({}, options.format, {
    list: names.list,
    object: names.object
  });

  const gui = defaults({}, options.gui, {
    add: `add-${names.list}@${names.target}:remember`,
    cancel: `view-${names.object}?@${names.target}:back`,
    resolve: `view-${names.object}?@${names.target}:back`,
  });

  const http = defaults({}, options.http, {
    list: `GET /api/${names.list}?`,
    send: `PUT /api/${names.object}`,
    view: `GET /api/${names.object}`
  });

  const permissions = defaults({}, options.permissions, {
    select: `${names.object}.${names.object}.edit`
  });

  checkFormat(format.list, options);
  checkFormat(format.object, options);
  checkRoute(gui, options);
  checkRoute(http, options);
  checkRoute(permissions, options);

  return {
    action: map[http.send.split(' ').shift()],
    add: gui.add ? true : false,
    format: formatString(format),
    gui: handleGui(gui),
    http: handleHttp(http),
    id: names.id,
    permission: filterPermission(permissions),
    options: http.options ? true : false,
    view: http.view ? true : false
  };
}
