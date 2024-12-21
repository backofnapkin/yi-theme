const primaryColorScheme = "light"; // Force light theme

// Always return light theme
function getPreferTheme() {
  return "light";
}

let themeValue = "light";

function setPreference() {
  localStorage.setItem("theme", "light");
  reflectPreference();
}

function reflectPreference() {
  document.firstElementChild.setAttribute("data-theme", "light");
  document.querySelector("#theme-btn")?.setAttribute("aria-label", "light");
}

// set early so no page flashes
reflectPreference();

function init() {
  reflectPreference();
  
  // Remove click listeners since we want to stay on light theme
  document.querySelector("#theme-btn")?.addEventListener("click", () => {
    // Do nothing - keep light theme
    reflectPreference();
  });
  
  document.querySelector("#theme-btn-mobile")?.addEventListener("click", () => {
    // Do nothing - keep light theme
    reflectPreference();
  });
}

window.onload = () => {
  init();
};

// Ignore system preference changes
window.matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", () => {
    // Do nothing - keep light theme
    reflectPreference();
  });
