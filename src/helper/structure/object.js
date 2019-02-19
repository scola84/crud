import { getString, stringFormat } from '@scola/d3-string-format';
import { DateTime } from 'luxon';

import formatError from '../format/error';

const skipTypes = [
  'checkbox',
  'file',
  'plain'
];

export default function structureObject(prefix, structures, options = {}) {
  return (route, data) => {
    const values = JSON.parse(data.values);

    const structure = [];
    const names = Object.keys(structures);

    let classes = null;
    let form = null;
    let name = null;
    let object = null;
    let subs = null;
    let sub = null;
    let text = null;

    if (values.object) {
      for (let i = 0; i < values.object.object.length; i += 1) {
        structure[structure.length] = {
          class: 'object',
          fields: [
            generateStructureError(prefix, values.object.object[i])
          ]
        };
      }
    }

    for (let i = 0; i < names.length; i += 1) {
      name = names[i];

      if (!values[name] || !values[name][name]) {
        continue;
      }

      subs = Object.keys(structures[name]);

      form = structures[name] &&
        structures[name][name] &&
        structures[name][name].edit ||
        structures[name][name].add;

      for (let k = 0; k < values[name][name].length; k += 1) {
        object = values[name][name][k];
        classes = [name];
        text = [];

        if (object.error) {
          classes.push('fail');
        } else {
          classes.push('pass');
        }

        if (object.exists ||
          object.include === false) {
          classes.push('skip');
        }

        text.push(stringFormat(name + '.title.l1')(0));

        structure[structure.length] = {
          class: classes.join(' '),
          text: text.join(' - '),
          fields: generateFields(name, name, form.form, object, options)
        };
      }

      for (let j = 0; j < subs.length; j += 1) {
        sub = subs[j];

        if (sub === name) {
          continue;
        }

        if (!values[name][sub]) {
          continue;
        }

        form = structures[name] &&
          structures[name][sub] &&
          structures[name][sub].edit ||
          structures[name][sub].add;

        for (let k = 0; k < values[name][sub].length; k += 1) {
          object = values[name][sub][k];
          classes = [name + '-' + sub];
          text = [];

          if (object.error) {
            classes.push('fail');
          } else {
            classes.push('pass');
          }

          if (object.exists ||
            object.include === false) {
            classes.push('skip');
          }

          text.push(stringFormat(name + '.title.l1')(0));
          text.push(stringFormat(name + '.' + sub + '.title.l1')(0) ||
            stringFormat(sub + '.title.l1')(0));

          structure[structure.length] = {
            class: classes.join(' '),
            text: text.join(' - '),
            fields: generateFields(name, sub, form.form, object, options)
          };
        }
      }
    }

    return structure;
  };
}

function generateFields(name, sub, form, values, options) {
  const fields = [];

  let code = null;
  let error = null;
  let field = null;
  let icon = null;
  let section = null;
  let text = null;

  form = typeof form === 'function' ? form() : form;

  if (values.error) {
    fields[fields.length] = generateFieldError(name, sub, values);
  }

  for (let i = 0; i < form.length; i += 1) {
    section = form[i];

    if (section.hidden === true) {
      continue;
    }

    for (let j = 0; j < section.fields.length; j += 1) {
      field = section.fields[j];

      if (typeof values[field.name] === 'undefined') {
        if (options.skip_undefined) {
          continue;
        }
      }

      if (skipTypes.indexOf(field.type) > -1) {
        continue;
      }

      if (typeof field.name === 'undefined') {
        continue;
      }

      if (field.name.match(/_id$/) && field.type !== 'text') {
        if (typeof values.error === 'undefined') {
          continue;
        }
      }

      code = name;
      code += name === sub ? '' : '.' + sub;
      code += '.form';
      code += '.' + (field.type === 'date' ? 'format' : 'value');
      code += '.' + field.name;

      error = null;
      icon = 'ion-ios-checkmark-circle-outline';

      if (values.error) {
        if (values.error.field) {
          if (values.error.field.name === field.name) {
            icon = 'ion-ios-close-circle-outline';
          }
        }
      }

      text = name === sub ?
        stringFormat(name + '.form.l1')(field.name) :
        stringFormat(name + '.' + sub + '.form.l1')(field.name);

      fields[fields.length] = {
        code,
        error,
        icon,
        name: field.name,
        originalType: field.type,
        type: 'plain',
        text: error ? null : text,
        value: (datum) => {
          if (datum.error) {
            return datum.error;
          }

          if (!datum.name) {
            return '';
          }

          if (datum.originalType === 'date') {
            return values[datum.name] ? DateTime
              .fromMillis(Number(values[datum.name]))
              .setZone('Europe/Amsterdam')
              .toFormat(getString()(datum.code)) : '';
          }

          return stringFormat(datum.code)(values[datum.name]) ||
            values[datum.name];
        }
      };
    }
  }

  return fields;
}

function generateFieldError(name, sub, values) {
  let value = '';

  if (values.error.field) {
    const format = name === sub ?
      stringFormat(name) :
      stringFormat(name + '.' + sub);

    values.error.result = values;

    value = formatError(format)(null, null, null, {
      error: values.error
    });
  } else {
    value = name === sub ?
      stringFormat(name + '.error.long')(values.error.reason) :
      stringFormat(name + '.' + sub + '.error.long')(values.error.reason);
  }

  return {
    name: 'error',
    type: 'plain',
    value: () => value
  };
}

function generateStructureError(prefix, values) {
  const [,
    status = '',
    code = 'unknown'
  ] = values.error.match(/(\d{3})?( ?.+)?/);

  let value = '';

  value += stringFormat(prefix + '.form.l1.error')(status) || status;
  value += ' ';
  value += stringFormat(prefix + '.form.value.error')(code.trim(), values) ||
    code.trim();

  return {
    name: 'error',
    type: 'plain',
    value: () => value
  };
}
