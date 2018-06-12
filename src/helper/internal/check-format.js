import { getString } from '@scola/d3-string-format';

export default function checkFormat(code, options) {
  if (typeof getString()(code) === 'undefined') {
    console.warn(`Format is corrupt: ${code} is undefined`, options);
  }
}
