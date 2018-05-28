export default function disableForm(structure, disabler) {
  if (Array.isArray(structure.form) === false) {
    return;
  }

  let section = null;

  for (let i = 0; i < structure.form.length; i += 1) {
    section = structure.form[i];

    for (let j = 0; j < section.fields.length; j += 1) {
      const { name, permission } = section.fields[j];

      disabler
        .hide({
          permission: permission || (() => true),
          selector: `li.${name}`
        });
    }
  }
}
