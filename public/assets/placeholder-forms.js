
document.addEventListener("submit", function (event) {
  var form = event.target;
  if (!(form instanceof HTMLFormElement)) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  var button = form.querySelector('button[type="submit"], input[type="submit"]');
  var original = button ? (button.textContent || button.value) : "";
  if (button) {
    if ("value" in button) button.value = "Заявка принята";
    button.textContent = "Заявка принята";
    button.disabled = true;
  }
  var note = form.querySelector(".static-form-note");
  if (!note) {
    note = document.createElement("div");
    note.className = "static-form-note";
    note.style.cssText = "margin-top:12px;padding:12px 16px;border-radius:8px;background:#eef8f0;color:#14612a;font-weight:600;";
    form.appendChild(note);
  }
  note.textContent = "Это демо-заглушка: данные пока никуда не отправляются.";
  window.setTimeout(function () {
    if (button) {
      if ("value" in button) button.value = original || "Отправить";
      button.textContent = original || "Отправить";
      button.disabled = false;
    }
  }, 2500);
}, true);
