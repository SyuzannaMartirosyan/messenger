import Handlebars from '../../app/helpers'
import template from './chat-item.hbs?raw'



export function renderChatItem ({avatar, alt ,time, lastMessange , unreadCount}){

return template ({avatar, alt ,time, lastMessange, unreadCount})
}
