import template from './chat-header.hbs?row'

export function renderChatHeader({avatar, alt , userName}){

return template ({avatar, alt , userName})
}