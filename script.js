const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const filterButtons = document.querySelectorAll(".filter-button");
const menuCards = document.querySelectorAll(".menu-card");
const passwordGate = document.querySelector("#password-gate");
const passwordForm = document.querySelector("#password-form");
const passwordInput = document.querySelector("#preview-password");
const gateError = document.querySelector("#gate-error");
const passwordHash = "3928b378992d1e2fcf3563891fd84221b9a52f641e2a9e2bafd5931372240b51";
const accessKey = "da-pizza-hub-preview-access";

const hashText = async (value) => {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

const unlockPreview = () => {
  document.body.classList.remove("locked");
  passwordGate.hidden = true;
};

if (sessionStorage.getItem(accessKey) === "granted") {
  unlockPreview();
} else {
  passwordInput?.focus();
}

passwordForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const enteredHash = await hashText(passwordInput.value);

  if (enteredHash === passwordHash) {
    sessionStorage.setItem(accessKey, "granted");
    unlockPreview();
    return;
  }

  gateError.hidden = false;
  passwordInput.select();
});

navToggle?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    nav.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    menuCards.forEach((card) => {
      card.hidden = filter !== "all" && card.dataset.category !== filter;
    });
  });
});
