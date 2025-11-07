import template from "./error-message.hbs"


export function renderMessageError({ code, message}) {
   
  return template({code, message});

}