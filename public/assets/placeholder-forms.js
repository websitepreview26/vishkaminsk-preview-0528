
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

(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function buildInput(type, name, placeholder, required) {
    var input = document.createElement("input");
    input.type = type;
    input.name = name;
    input.placeholder = placeholder;
    if (required) input.required = true;
    return input;
  }

  function enhanceHomePage() {
    var hero = document.querySelector(".elementor-3604 .elementor-element-8d1bf74 > .e-con-inner");
    if (!hero || hero.querySelector(".vm-quick-order")) return;

    var proof = document.createElement("div");
    proof.className = "vm-hero-proof";
    proof.innerHTML = [
      '<div class="vm-proof-item"><strong>1 час</strong><span>подача по Минску при наличии машины</span></div>',
      '<div class="vm-proof-item"><strong>22-28 м</strong><span>рабочая высота под большинство задач</span></div>',
      '<div class="vm-proof-item"><strong>7 дней</strong><span>работаем без выходных и лишних простоев</span></div>'
    ].join("");
    hero.appendChild(proof);

    var card = document.createElement("aside");
    card.className = "vm-quick-order";
    card.innerHTML = [
      '<div class="vm-quick-order__eyebrow">Быстрая заявка</div>',
      "<h3>Уточнить цену и свободную автовышку</h3>",
      "<p>Оставьте телефон, и мы подскажем подходящую высоту, время подачи и ориентир по стоимости.</p>"
    ].join("");

    var form = document.createElement("form");
    form.setAttribute("data-static-placeholder", "true");
    form.action = "#";
    form.appendChild(buildInput("text", "name", "Ваше имя", false));
    form.appendChild(buildInput("tel", "phone", "+375 __ ___-__-__", true));

    var select = document.createElement("select");
    select.name = "height";
    select.innerHTML = [
      '<option value="">Высота автовышки</option>',
      '<option value="22">22 метра</option>',
      '<option value="28">28 метров</option>',
      '<option value="unknown">Нужна консультация</option>'
    ].join("");
    form.appendChild(select);

    var button = document.createElement("button");
    button.type = "submit";
    button.textContent = "Получить расчёт";
    form.appendChild(button);
    card.appendChild(form);

    var meta = document.createElement("div");
    meta.className = "vm-quick-order__meta";
    meta.textContent = "Перезваниваем быстро, без рассылок";
    card.appendChild(meta);
    hero.appendChild(card);
  }

  function addStickyCta() {
    if (document.querySelector(".vm-sticky-cta")) return;
    var sticky = document.createElement("div");
    sticky.className = "vm-sticky-cta";
    sticky.innerHTML = [
      '<a class="vm-sticky-cta__phone" href="tel:+375292051579">Позвонить</a>',
      '<a class="vm-sticky-cta__primary" href="#form-field-field_197ba03">Заявка</a>'
    ].join("");
    document.body.appendChild(sticky);
  }

  function toggleStickyCta() {
    var isScrolled = window.scrollY > 420;
    document.body.classList.toggle("vm-scrolled", isScrolled);
  }

  function improvePrimaryActions() {
    var callbackLinks = document.querySelectorAll('a[href$="contact-us/index.html"], a[href="../contact-us/index.html"]');
    callbackLinks.forEach(function (link) {
      var text = link.textContent.trim();
      if (/заказать|звонок|аренду/i.test(text)) {
        link.setAttribute("href", "#form-field-field_197ba03");
      }
    });

    document.addEventListener("click", function (event) {
      var anchor = event.target.closest('a[href^="#form-field"]');
      if (!anchor) return;
      var target = document.querySelector(anchor.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      window.setTimeout(function () {
        target.focus({ preventScroll: true });
      }, 400);
    });
  }

  ready(function () {
    enhanceHomePage();
    improvePrimaryActions();
    addStickyCta();
    toggleStickyCta();
    window.addEventListener("scroll", toggleStickyCta, { passive: true });
  });
})();
