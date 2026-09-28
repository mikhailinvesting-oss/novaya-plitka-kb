// Общий модуль для сайдбара и сквозного поиска по всей базе знаний.
// Подключается на каждой странице ПОСЛЕ kb-structure.js и search-index.js,
// и ДО собственного инлайн-скрипта документа.
// Ничего не знает о конкретном документе — вся специфика передаётся параметрами.
var KB = (function () {
  "use strict";

  function svgUse(id, w, h) {
    return '<svg width="' + (w || 16) + '" height="' + (h || 16) + '"><use href="#' + id + '"/></svg>';
  }

  // Рисует список документов (или "ссылка/скоро") внутри переданного контейнера.
  function renderDocs(docs, container, currentDocUrl, localSections, goToFn) {
    docs.forEach(function (doc) {
      var isCurrent = doc.url === currentDocUrl;

      if (isCurrent) {
        var head = document.createElement("div");
        head.className = "nav-item is-doc is-current";
        head.innerHTML =
          '<span class="num">' + svgUse("i-book", 12, 12) + "</span>" +
          '<span class="label">' + doc.title + "</span>";
        container.appendChild(head);

        var sub = document.createElement("div");
        sub.className = "nav-sub";
        (localSections || []).forEach(function (s) {
          var btn = document.createElement("button");
          btn.className = "nav-subitem";
          btn.setAttribute("data-target", s.id);
          btn.textContent = s.id === "home" ? "Обзор" : (s.num ? s.num + ". " : "") + s.title;
          btn.addEventListener("click", function () { goToFn(s.id); });
          sub.appendChild(btn);
          (s.children || []).forEach(function (c) {
            var cbtn = document.createElement("button");
            cbtn.className = "nav-subitem nav-subitem-child";
            cbtn.setAttribute("data-target", c.id);
            cbtn.textContent = (c.num ? c.num + " " : "") + c.title;
            cbtn.addEventListener("click", function () { goToFn(s.id, c.id); });
            sub.appendChild(cbtn);
          });
        });
        container.appendChild(sub);
      } else if (doc.ready && doc.url) {
        var a = document.createElement("a");
        a.className = "nav-item is-doc";
        a.href = doc.url;
        if (doc.external) { a.target = "_blank"; a.rel = "noopener"; }
        a.innerHTML =
          '<span class="num">' + svgUse(doc.external ? "i-box" : "i-link", 12, 12) + "</span>" +
          '<span class="label">' + doc.title + (doc.external ? "<small>Google Диск</small>" : "") + "</span>";
        container.appendChild(a);
      } else {
        var d = document.createElement("div");
        d.className = "nav-item is-doc is-soon";
        d.innerHTML =
          '<span class="num">' + svgUse("i-book", 12, 12) + "</span>" +
          '<span class="label">' + doc.title + "<small>Скоро</small></span>";
        container.appendChild(d);
      }
    });
  }

  function catDocs(cat) {
    if (cat.docs) return cat.docs;
    if (cat.folders) return [].concat.apply([], cat.folders.map(function (f) { return f.docs; }));
    return [];
  }

  // Рисует общий сайдбар: дерево категорий/документов базы знаний,
  // а под текущим документом — вложенный список его собственных разделов.
  // Категории сворачиваемые: открыта только та, где лежит текущий документ.
  // Категория может содержать либо docs напрямую, либо folders (папка -> docs) —
  // тогда внутри категории рисуются ещё и вложенные сворачиваемые папки.
  function renderNav(navEl, currentDocUrl, localSections, goToFn) {
    navEl.innerHTML = "";

    KB_STRUCTURE.forEach(function (cat) {
      var isCurrentCat = catDocs(cat).some(function (d) { return d.url === currentDocUrl; });

      var label = document.createElement("div");
      label.className = "nav-cat-label" + (isCurrentCat ? " is-open" : "");
      label.innerHTML = '<span>' + cat.cat + '</span>' + svgUse("i-chevron", 10, 10);

      var group = document.createElement("div");
      group.className = "nav-cat-group" + (isCurrentCat ? "" : " is-collapsed");

      label.addEventListener("click", function () {
        var collapsed = group.classList.toggle("is-collapsed");
        label.classList.toggle("is-open", !collapsed);
      });

      navEl.appendChild(label);

      if (cat.folders) {
        cat.folders.forEach(function (folder) {
          var isCurrentFolder = folder.docs.some(function (d) { return d.url === currentDocUrl; });

          var subLabel = document.createElement("div");
          subLabel.className = "nav-folder-label" + (isCurrentFolder ? " is-open" : "");
          subLabel.innerHTML = '<span>' + folder.name + '</span>' + svgUse("i-chevron", 9, 9);

          var subGroup = document.createElement("div");
          subGroup.className = "nav-folder-group" + (isCurrentFolder ? "" : " is-collapsed");

          subLabel.addEventListener("click", function (e) {
            e.stopPropagation();
            var collapsed = subGroup.classList.toggle("is-collapsed");
            subLabel.classList.toggle("is-open", !collapsed);
          });

          group.appendChild(subLabel);
          renderDocs(folder.docs, subGroup, currentDocUrl, localSections, goToFn);
          group.appendChild(subGroup);
        });
      } else {
        renderDocs(cat.docs, group, currentDocUrl, localSections, goToFn);
      }

      navEl.appendChild(group);
    });

    // подсветка активного пункта текущего документа обновляется вызовами goTo()
  }

  function markActiveNavItem(sectionId) {
    document.querySelectorAll(".nav-subitem").forEach(function (b) {
      b.classList.toggle("is-active", b.getAttribute("data-target") === sectionId);
    });
  }

  // Рисует хлебные крошки в шапке: База знаний / Текущий документ / Текущий раздел
  function renderBreadcrumb(currentDocUrl, sectionTitle) {
    var docTitle = "";
    KB_STRUCTURE.forEach(function (cat) {
      catDocs(cat).forEach(function (doc) {
        if (doc.url === currentDocUrl) docTitle = doc.title;
      });
    });
    var html = '<a href="Хаб.html">База знаний</a>';
    if (docTitle) html += '<span class="crumb-sep">/</span><span class="crumb-cur">' + docTitle + '</span>';
    if (sectionTitle && sectionTitle !== docTitle) {
      html += '<span class="crumb-sep">/</span><span class="crumb-cur">' + sectionTitle + '</span>';
    }
    var el = document.getElementById("breadcrumb");
    if (el) el.innerHTML = html;
    var elm = document.getElementById("breadcrumbMobile");
    if (elm) elm.innerHTML = html;
  }

  function highlightNode(node) {
    if (!node) return;
    node.scrollIntoView({ block: "center", behavior: "smooth" });
    node.classList.add("flash");
    setTimeout(function () { node.classList.remove("flash"); }, 1700);
  }

  // Ищет в пределах текущего DOM (открытый документ) .searchable-элемент,
  // текст которого содержит нужный фрагмент — используется и для локального
  // клика по результату, и для подсветки после перехода с другой страницы.
  function findSearchableNode(sectionId, text) {
    var section = document.getElementById(sectionId);
    if (!section) return null;
    var nodes = section.querySelectorAll(".searchable");
    var needle = (text || "").slice(0, 40).toLowerCase();
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].textContent.toLowerCase().indexOf(needle) > -1) return nodes[i];
    }
    return nodes[0] || null;
  }

  function highlightMatch(text, q) {
    var idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return text.slice(0, 120);
    var start = Math.max(0, idx - 40);
    var end = Math.min(text.length, idx + q.length + 80);
    return (
      (start > 0 ? "…" : "") +
      text.slice(start, idx) +
      "<mark>" + text.slice(idx, idx + q.length) + "</mark>" +
      text.slice(idx + q.length, end) +
      (end < text.length ? "…" : "")
    );
  }

  // Подключает сквозной поиск по ВСЕЙ базе знаний (KB_SEARCH_INDEX),
  // с переходом на другой документ, если результат найден не в текущем.
  function initSearch(inputEl, resultsEl, currentDocUrl, goToFn) {
    function closeSearch() { resultsEl.classList.remove("is-open"); }

    inputEl.addEventListener("input", function () {
      var q = inputEl.value.trim();
      if (q.length < 2) { closeSearch(); return; }
      var ql = q.toLowerCase();
      var matches = KB_SEARCH_INDEX.filter(function (item) {
        return item.text.toLowerCase().indexOf(ql) > -1;
      }).slice(0, 12);

      resultsEl.innerHTML = "";
      if (!matches.length) {
        resultsEl.innerHTML = '<div class="sr-empty">Ничего не найдено по запросу «' + q + '»</div>';
      } else {
        matches.forEach(function (m) {
          var item = document.createElement("button");
          item.className = "sr-item";
          var docLabel = m.docUrl === currentDocUrl ? m.sectionTitle : m.doc + " · " + m.sectionTitle;
          item.innerHTML =
            '<span class="sr-sec">' + docLabel + "</span>" +
            '<span class="sr-snip">' + highlightMatch(m.text, q) + "</span>";
          item.addEventListener("click", function () {
            if (m.docUrl === currentDocUrl) {
              goToFn(m.sectionId);
              closeSearch();
              inputEl.blur();
              setTimeout(function () { highlightNode(findSearchableNode(m.sectionId, m.text)); }, 60);
            } else {
              var url = m.docUrl + "?q=" + encodeURIComponent(m.text.slice(0, 40)) + "#" + m.sectionId;
              window.location.href = url;
            }
          });
          resultsEl.appendChild(item);
        });
      }
      resultsEl.classList.add("is-open");
    });

    document.addEventListener("click", function (e) {
      if (!e.target.closest(".search-wrap")) closeSearch();
    });
  }

  // Если на страницу пришли по ссылке из результата поиска на другом
  // документе — довести до нужного раздела и подсветить нужный абзац.
  function handleIncomingSearch(goToFn) {
    var params = new URLSearchParams(window.location.search);
    var q = params.get("q");
    var sectionId = (window.location.hash || "").replace("#", "");
    if (!q || !sectionId) return;
    goToFn(sectionId);
    setTimeout(function () { highlightNode(findSearchableNode(sectionId, q)); }, 200);
  }

  return {
    renderNav: renderNav,
    markActiveNavItem: markActiveNavItem,
    renderBreadcrumb: renderBreadcrumb,
    initSearch: initSearch,
    handleIncomingSearch: handleIncomingSearch
  };
})();
