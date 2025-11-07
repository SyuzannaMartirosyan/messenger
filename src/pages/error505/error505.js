import Handlebars from '../../app/helpers'
import template from './error505.hbs?raw'


export function renderError505(root) {
  const render = Handlebars.compile(template)
  const html = render({})
  root.innerHTML = html
}

//это нужно будет убрать после организации роутинга
document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector(".button");

  if (!button) return; 

  button.addEventListener("click", (event) => {
    event.preventDefault();
    
    window.location.href = "http://localhost:3000/messenger.html";
  });
});