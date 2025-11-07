import Handlebars from '../../app/helpers'
import template from './login.hbs?raw'


export function renderLogin(root) {
  const render = Handlebars.compile(template)
  const html = render({})
  root.innerHTML = html
}

