// Apply theme from localStorage or default to dark
document.addEventListener("DOMContentLoaded", function () {
  try {
    const theme = localStorage.getItem("theme") || "dark";
    document.documentElement.classList.add(theme);
  } catch (e) {
    document.documentElement.classList.add("dark");
  }
});

// Define global theme toggle function
window.toggleTheme = function () {
  const isDark = document.documentElement.classList.contains("dark");
  document.documentElement.classList.remove(isDark ? "dark" : "light");
  document.documentElement.classList.add(isDark ? "light" : "dark");
  try {
    localStorage.setItem("theme", isDark ? "light" : "dark");
  } catch (e) {
    console.error("LocalStorage not available");
  }
};
