import '../styles/index.scss'
import { renderLogin } from '../pages/login/login'
import { renderRegistration } from '../pages/registration/registration'
import { renderMessenger } from '../pages/messenger/messenger'

import {renderError404} from '../pages/error404/error404'
import {renderError505} from '../pages/error505/error505'
import { renderProfilePage } from "../pages/profile/profile.js"




const loginBlock = document.querySelector('#app')
if (loginBlock) {
  renderLogin(loginBlock)
}

const registrationBlock = document.querySelector('#appRegistration')
if (registrationBlock) {
  renderRegistration(registrationBlock)
}

const appMessanger = document.querySelector("#appMessanger")

if (appMessanger) {
  renderMessenger(appMessanger, chat => {
    renderChatPanel(document.querySelector("#chatPanelRoot"), chat)
  })
}

const appErorr404 = document.querySelector("#appErorr404")

if (appErorr404) {
  renderError404(appErorr404)
}

const appErorr505 = document.querySelector("#appErorr505")

if (appErorr505) {
  renderError505(appErorr505)
}



const profilePage = document.querySelector("#appProfilePage")

if (profilePage) {
 renderProfilePage(profilePage)
}
