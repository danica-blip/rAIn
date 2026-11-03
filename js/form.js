// rain co. assessment form
// 1. Follow SETUP.md to deploy the Google Apps Script.
// 2. Paste your Web app URL between the quotes below.
const FORM_ENDPOINT = "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";

(function () {
  const form = document.getElementById("assessment-form");
  if (!form) return;
  const status = document.getElementById("form-status");
  const success = document.getElementById("form-success");
  const button = form.querySelector('button[type="submit"]');

  function showError(msg) {
    status.textContent = msg;
    status.classList.add("error");
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    status.textContent = "";
    status.classList.remove("error");

    if (!form.elements.businessType.value) {
      showError("Pick the kind of business you run.");
      return;
    }
    const required = ["name", "business", "email"];
    for (const id of required) {
      const input = form.elements[id];
      if (!input.value.trim()) {
        showError("Add your " + (id === "business" ? "business name" : id) + " so we can reach you.");
        input.focus();
        return;
      }
    }
    if (!form.elements.email.checkValidity()) {
      showError("Check your email address. It looks incomplete.");
      form.elements.email.focus();
      return;
    }
    if (FORM_ENDPOINT.indexOf("PASTE_") === 0) {
      showError("The form isn’t connected yet. Add your Apps Script URL in js/form.js.");
      return;
    }

    button.disabled = true;
    button.textContent = "Sending…";
    const data = new URLSearchParams(new FormData(form));

    try {
      // Google Apps Script doesn't return readable CORS headers, so we send
      // "no-cors" and treat a completed request as delivered.
      await fetch(FORM_ENDPOINT, { method: "POST", mode: "no-cors", body: data });
      const first = form.elements.name.value.trim().split(/\s+/)[0];
      document.getElementById("success-name").textContent = first || "friend";
      form.hidden = true;
      success.classList.add("show");
      success.focus();
    } catch (err) {
      showError("Your request didn’t send. Check your connection and try again, or call us.");
      button.disabled = false;
      button.textContent = "Book my free assessment";
    }
  });
})();
