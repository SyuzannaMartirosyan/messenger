import Handlebars from '../../app/helpers'
import template from './error404.hbs?raw'


export function renderError404(root) {
  const render = Handlebars.compile(template)
  const html = render({})
  root.innerHTML = html
}

