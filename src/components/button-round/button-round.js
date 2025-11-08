import template from './button-round.hbs';

export function renderButtonRound({
  text,
  type = 'button',
  modifier,
  ariaLabel,
  icon,
  alt,
  dataRoute,
}) {
  return template({ text, type, modifier, ariaLabel, icon, alt, dataRoute });
}
