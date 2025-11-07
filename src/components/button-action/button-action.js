import template from "./button-action.hbs"


export function renderButtonAction({ text,circlesColor, type = 'button' }) {
   
  return template({ text, circlesColor, type })

}