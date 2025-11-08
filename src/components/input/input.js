import template from './input.hbs';

export function renderInput({
  label,
  name,
  type = 'text',
  placeholder = '',
  autocomplete,
  required = false,
}) {
  return template({
    label,
    name,
    type,
    placeholder,
    autocomplete,
    required,
  });
}
