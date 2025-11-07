import template from "./info-field.hbs"


export function renderInfoField({ label ,isEditable , type, name, value }) {
   
  return template({ label ,isEditable , type, name, value });

}