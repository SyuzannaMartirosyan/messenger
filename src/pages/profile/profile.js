import Handlebars from "handlebars"
import template from "./profile.hbs?raw"
import { profileData } from "../../mock/profile.js"



const profileTemplate = Handlebars.compile(template)

export function renderProfilePage(root) {
  const html = profileTemplate(profileData)
  root.innerHTML = html
}
