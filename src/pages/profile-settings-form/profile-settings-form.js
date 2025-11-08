import Handlebars from 'handlebars';
import template from './profile-settings-form.hbs?raw';

const templateForm = Handlebars.compile(template);

export function renderProfileSettingsForm(root) {
  root.innerHTML = templateForm();
}
