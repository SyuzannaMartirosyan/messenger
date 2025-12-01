

import Handlebars from 'handlebars';
export default Handlebars;


// Универсальный переход по кнопкам (временное решение до роутинга
document.addEventListener("DOMContentLoaded",() => {
  document.addEventListener("click", (event) => {
    const button = event.target.closest(".button")

    if (!button) return;

    event.preventDefault();

    const route = button.dataset.route;

    if (route) {
      window.location.href = route;
    } 
  });
});
