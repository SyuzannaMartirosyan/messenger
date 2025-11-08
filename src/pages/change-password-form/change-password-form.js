import Handlebars from "handlebars"
import template from "./change-password-form.hbs?raw"



const templateForm = Handlebars.compile(template)

export function renderChangePasswordForm(root) {
 root.innerHTML = templateForm()
}
