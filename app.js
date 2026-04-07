let allEvents = [];

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const eventsList = document.getElementById("eventsList");
const miniTimeline = document.getElementById("miniTimeline");

async function loadEvents() {
  try {
    const response = await fetch("events.json");
    if (!response.ok) {
      throw new Error("Impossibile caricare events.json");
    }

    allEvents = await response.json();
    allEvents = sortEvents(allEvents);

    renderMiniTimeline(allEvents);
    renderEvents(allEvents);
    bindFilters();
  } catch (error) {
    console.error(error);
    eventsList.innerHTML = `<div class="empty-state">Errore nel caricamento degli eventi.</div>`;
    miniTimeline.innerHTML = `<div class="empty-state">Errore nel caricamento della timeline sintetica.</div>`;
  }
}

function sortEvents(events) {
  return [...events].sort((a, b) => {
    const yearA = Number(a.year);
    const yearB = Number(b.year);
    return yearA - yearB;
  });
}

function bindFilters() {
  searchInput.addEventListener("input", applyFilters);
  categoryFilter.addEventListener("change", applyFilters);
}

function applyFilters() {
  const term = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;

  const filtered = allEvents.filter((event) => {
    const matchesCategory = category === "all" || event.category === category;

    const haystack = [
      event.date,
      event.title,
      event.description,
      event.categoryLabel,
      event.notes || ""
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = !term || haystack.includes(term);

    return matchesCategory && matchesSearch;
  });

  renderMiniTimeline(filtered);
  renderEvents(filtered);
}

function renderMiniTimeline(events) {
  if (!events.length) {
    miniTimeline.innerHTML = `<div class="empty-state">Nessun evento trovato.</div>`;
    return;
  }

  miniTimeline.innerHTML = `
    <div class="timeline-line"></div>
    ${events
      .map((event, index) => {
        const side = index % 2 === 0 ? "top" : "bottom";

        return `
          <div class="timeline-item ${side}">
            <div class="timeline-point"></div>
            <div class="timeline-card">
              <span class="mini-date">${escapeHtml(event.date)}</span>
              <h3 class="mini-title">${escapeHtml(event.title)}</h3>
              <div class="mini-category">${escapeHtml(event.categoryLabel)}</div>
            </div>
          </div>
        `;
      })
      .join("")}
  `;
}

function renderEvents(events) {
  if (!events.length) {
    eventsList.innerHTML = `<div class="empty-state">Nessun evento corrisponde ai filtri selezionati.</div>`;
    return;
  }

  eventsList.innerHTML = events
    .map(
      (event) => `
        <article class="event-card">
          <span class="event-date">${escapeHtml(event.date)}</span>
          <div class="event-top">
            <h3 class="event-title">${escapeHtml(event.title)}</h3>
            <span class="event-category">${escapeHtml(event.categoryLabel)}</span>
          </div>
          <p class="event-description">${escapeHtml(event.description)}</p>
          ${
            event.notes
              ? `<div class="event-notes">${escapeHtml(event.notes)}</div>`
              : ""
          }
        </article>
      `
    )
    .join("");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

loadEvents();