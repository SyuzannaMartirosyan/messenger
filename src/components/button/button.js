import template from './button.hbs';

export function renderButtonPrimary({
  text,
  type = 'button',
  modifier,
  icon,
  dataRoute,
}) {
  return template({ text, type, modifier, icon, dataRoute });
}
