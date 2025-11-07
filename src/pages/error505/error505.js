import Handlebars from '../../app/helpers'
import template from './error505.hbs?raw'


export function renderError505(root) {
  const render = Handlebars.compile(template)
  const html = render({})
  root.innerHTML = html
}

