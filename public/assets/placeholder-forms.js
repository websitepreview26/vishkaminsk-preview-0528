
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
      '<div class="vm-proof-item"><strong>Подача от 1 часа</strong></div>',
      '<div class="vm-proof-item"><strong>22-28 м</strong></div>',
      '<div class="vm-proof-item"><strong>Без выходных</strong></div>'
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

  function addMobileHeaderActions() {
    var header = document.querySelector(".whb-header");
    var mobileCenter = document.querySelector(".whb-mobile-center");
    if (!header || !mobileCenter || mobileCenter.querySelector(".vm-mobile-header-actions")) return;

    var actions = document.createElement("div");
    actions.className = "vm-mobile-header-actions";
    actions.innerHTML = '<a class="vm-mobile-call" href="tel:+375292051579" aria-label="Позвонить +375 29 205-15-79">+375 29 205-15-79</a>';
    mobileCenter.appendChild(actions);

  }

  function addDesktopHeaderPhone() {
    var headerRight = Array.prototype.find.call(
      document.querySelectorAll(".whb-general-header .whb-col-right.whb-visible-lg"),
      function (column) {
        return column.querySelector(".wd-button-wrapper");
      }
    );
    var button = headerRight ? headerRight.querySelector(".wd-button-wrapper") : null;
    if (!headerRight || !button || headerRight.querySelector(".vm-header-phone")) return;

    var phone = document.createElement("a");
    phone.className = "vm-header-phone";
    phone.href = "tel:+375292051579";
    phone.textContent = "+375 29 205-15-79";
    headerRight.insertBefore(phone, button);
  }

  function addFloatingCall() {
    if (document.querySelector(".vm-floating-call")) return;
    var call = document.createElement("a");
    call.className = "vm-floating-call";
    call.href = "tel:+375292051579";
    call.setAttribute("aria-label", "Позвонить +375 29 205-15-79");
    call.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6.6 10.8c1.7 3.4 3.2 4.9 6.6 6.6l2.2-2.2c.3-.3.8-.4 1.2-.2 1.3.4 2.6.7 4 .7.7 0 1.2.5 1.2 1.2v3.5c0 .7-.5 1.2-1.2 1.2C10.6 21.6 2.4 13.4 2.4 3.4c0-.7.5-1.2 1.2-1.2h3.5c.7 0 1.2.5 1.2 1.2 0 1.4.2 2.7.7 4 .1.4 0 .8-.3 1.2l-2.1 2.2z"></path></svg><span>Позвонить</span>';
    document.body.appendChild(call);
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

  function getContactHref(scope) {
    var link = scope.querySelector('a[href$="contact-us/index.html"], a[href="../contact-us/index.html"]');
    if (link) return link.getAttribute("href");
    var isHome = window.location.pathname === "/" || /\/public\/index\.html$/.test(window.location.pathname);
    return isHome ? "./contact-us/index.html" : "../contact-us/index.html";
  }

  function enhanceFooter() {
    document.querySelectorAll(".footer-container").forEach(function (footer) {
      if (footer.classList.contains("vm-footer-enhanced")) return;
      footer.classList.add("vm-footer-enhanced");

      var main = footer.querySelector(".main-footer");
      var firstColumn = footer.querySelector(".footer-column-1");
      var secondColumn = footer.querySelector(".footer-column-2");
      var thirdColumn = footer.querySelector(".footer-column-3");
      var fourthColumn = footer.querySelector(".footer-column-4");
      var contactHref = getContactHref(footer);

      if (firstColumn && !firstColumn.querySelector(".vm-footer-copy")) {
        var copy = document.createElement("p");
        copy.className = "vm-footer-copy";
        copy.textContent = "Автовышки 22–28 м для фасадных, монтажных и коммунальных работ. Подача по Минску и области от 1 часа.";
        firstColumn.appendChild(copy);
      }

      var title = secondColumn ? secondColumn.querySelector(".widget-title") : null;
      if (title) title.textContent = "Навигация";

      if (thirdColumn) {
        thirdColumn.innerHTML = [
          '<div class="vm-footer-cta">',
          '<div class="vm-footer-cta__label">Быстрая заявка</div>',
          '<a class="vm-footer-cta__phone" href="tel:+375292051579">+375 29 205-15-79</a>',
          '<p>Подберём высоту, время подачи и ориентир по стоимости.</p>',
          '<a class="vm-footer-cta__button" href="' + contactHref + '">Оставить заявку</a>',
          '</div>'
        ].join("");
      }

      if (fourthColumn) {
        fourthColumn.innerHTML = [
          '<div class="vm-footer-meta">',
          '<h5>Условия</h5>',
          '<span>Минск и область</span>',
          '<span>Подача от 1 часа</span>',
          '<span>Работаем без выходных</span>',
          '</div>'
        ].join("");
      }

      if (main && !main.querySelector(".vm-footer-bottom")) {
        var bottom = document.createElement("div");
        bottom.className = "vm-footer-bottom";
        bottom.innerHTML = '<span>© vishka.minsk.by</span><span>Аренда автовышек 22–28 м</span>';
        main.appendChild(bottom);
      }
    });
  }

  ready(function () {
    enhanceHomePage();
    improvePrimaryActions();
    enhanceFooter();
    addDesktopHeaderPhone();
    addMobileHeaderActions();
    addFloatingCall();
  });
})();
