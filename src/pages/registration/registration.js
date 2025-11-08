import Handlebars from '../../app/helpers';
import template from './registration.hbs?raw';

export function renderRegistration(root) {
  const render = Handlebars.compile(template);
  const html = render({});
  root.innerHTML = html;
}
