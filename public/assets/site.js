
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
      '<div class="vm-proof-item"><strong>Быстрая подача: до 1 часа</strong></div>',
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
    select.setAttribute("aria-label", "Высота автовышки");
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

    var mobileCta = document.createElement("section");
    mobileCta.className = "vm-home-mobile-cta";
    mobileCta.innerHTML = [
      "<h2>Нужна автовышка на объект?</h2>",
      "<p>Позвоните: сразу уточним детали и сориентируем по свободным машинам.</p>",
      '<a class="vm-home-mobile-cta__phone" href="tel:+375292051579">+375 29 205-15-79</a>',
      '<a class="vm-home-mobile-cta__button" href="tel:+375292051579">Позвонить</a>'
    ].join("");
    hero.insertBefore(mobileCta, proof);
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

  function enhanceFooter() {
    document.querySelectorAll(".footer-container").forEach(function (footer) {
      if (footer.classList.contains("vm-footer-enhanced")) return;
      footer.classList.add("vm-footer-enhanced");

      var main = footer.querySelector(".main-footer");
      var firstColumn = footer.querySelector(".footer-column-1");
      var secondColumn = footer.querySelector(".footer-column-2");

      if (firstColumn && !firstColumn.querySelector(".vm-footer-copy")) {
        var copy = document.createElement("p");
        copy.className = "vm-footer-copy";
        copy.textContent = "Автовышки 22–28 м для фасадных, монтажных и коммунальных работ. Подача по Минску и области до 1 часа.";
        firstColumn.appendChild(copy);
      }

      var title = secondColumn ? secondColumn.querySelector(".widget-title") : null;
      if (title) title.textContent = "Навигация";

      if (main && !main.querySelector(".vm-footer-bottom")) {
        var bottom = document.createElement("div");
        bottom.className = "vm-footer-bottom";
        bottom.innerHTML = '<span>© vyshka24.by</span><span>Аренда автовышек 22–28 м</span>';
        main.appendChild(bottom);
      }
    });
  }

  function enableLandingNavigation() {
    document.addEventListener("click", function (event) {
      var anchor = event.target.closest('a[href^="#"]');
      if (!anchor) return;

      var selector = anchor.getAttribute("href");
      if (!/^#(services|avtopark|reviews|contacts)$/.test(selector)) return;

      var target = document.querySelector(selector);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });

      var mobileNav = anchor.closest(".mobile-nav");
      var closeSide = document.querySelector(".wd-close-side");
      if (mobileNav && closeSide) {
        window.setTimeout(function () {
          closeSide.click();
        }, 0);
      }
    });
  }

  function enableStaticNavigation() {
    var opener = document.querySelector(".wd-header-mobile-nav");
    var nav = document.querySelector(".mobile-nav");
    var overlay = document.querySelector(".wd-close-side");
    var scrollTop = document.querySelector(".scrollToTop");
    var closeButton = null;

    function closeNavigation() {
      if (nav) nav.classList.remove("wd-opened");
      if (overlay) overlay.classList.remove("wd-close-side-opened");
      if (opener) {
        var openerLink = opener.querySelector("a");
        if (openerLink) openerLink.setAttribute("aria-expanded", "false");
      }
    }

    if (opener && nav && overlay) {
      closeButton = nav.querySelector(".vm-mobile-nav-close");
      if (!closeButton) {
        closeButton = document.createElement("button");
        closeButton.type = "button";
        closeButton.className = "vm-mobile-nav-close";
        closeButton.setAttribute("aria-label", "Закрыть меню");
        closeButton.innerHTML = '<span aria-hidden="true"></span>';
        nav.insertBefore(closeButton, nav.firstChild);
      }

      opener.addEventListener("click", function (event) {
        event.preventDefault();
        nav.classList.add("wd-opened");
        overlay.classList.add("wd-close-side-opened");
        var openerLink = opener.querySelector("a");
        if (openerLink) openerLink.setAttribute("aria-expanded", "true");
      });
      closeButton.addEventListener("click", closeNavigation);
      overlay.addEventListener("click", closeNavigation);
      document.addEventListener("click", function (event) {
        if (event.target.closest(".wd-close-side")) closeNavigation();
      });
      nav.addEventListener("click", function (event) {
        if (event.target.closest("a")) closeNavigation();
      });
      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") closeNavigation();
      });
    }

    if (scrollTop) {
      window.addEventListener("scroll", function () {
        scrollTop.classList.toggle("button-show", window.scrollY > 250);
      }, { passive: true });
      scrollTop.addEventListener("click", function (event) {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }

  ready(function () {
    enhanceHomePage();
    improvePrimaryActions();
    enhanceFooter();
    addDesktopHeaderPhone();
    addMobileHeaderActions();
    addFloatingCall();
    enableLandingNavigation();
    enableStaticNavigation();
  });
})();
