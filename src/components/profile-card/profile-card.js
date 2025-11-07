import template from "./profile-card.hbs"


export function renderProfileCard({ avatarSrc, name, lastName}) {
   
  return template({avatarSrc, name, lastName });

}