const merchants = [
  {
    name: "Africa World Airlines",
    recordingLabel: "AWA - Ghana MI 18.03.26",
    listenLabel: "Listen to Eric",
    iconIndex: 0,
    copy: [
      "AWA's payment volume through Paystack grew ",
      { highlight: "4x" },
      " in 2025. Eric, from AWA's IT team, was clear about why",
    ],
  },
  {
    name: "Achieve by Petra",
    recordingLabel: "ACH - Ghana MI 11.03.26",
    listenLabel: "Listen to Sharon",
    iconIndex: 1,
    copy: [
      "Achieve moved from manual virtual account workflows to instant transfers and saw a ",
      { highlight: "100%" },
      " success rate on completed Paystack transactions.",
    ],
  },
  {
    name: "WARC",
    recordingLabel: "WARC - Ghana MI 18.03.26",
    listenLabel: "Listen to Felipe",
    iconIndex: 2,
    copy: [
      "WARC used Paystack Transfers to pay thousands of farmers and reported roughly a ",
      { highlight: "97%" },
      " success rate in northern Ghana's tougher network conditions.",
    ],
  },
];

const state = {
  activeIndex: 0,
};

const merchantNameEl = document.querySelector("#merchant-name");
const merchantCopyEl = document.querySelector("#merchant-copy");
const listenLabelEl = document.querySelector("#listen-label");
const cassetteOrbitEl = document.querySelector("#cassette-orbit");
const orbitSpacingSliderEl = document.querySelector("#orbit-spacing");
const orbitSpacingValueEl = document.querySelector("#orbit-spacing-value");
const prevButtonEl = document.querySelector("#nav-prev");
const nextButtonEl = document.querySelector("#nav-next");
const navButtons = Array.from(document.querySelectorAll(".merchant-nav__icon"));

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function renderCopy(copy) {
  return copy
    .map((chunk) => {
      if (typeof chunk === "string") {
        return chunk;
      }

      return `<span class="highlight">${chunk.highlight}</span>`;
    })
    .join("");
}

function createCassetteMarkup(merchant, index) {
  return `
    <article class="cassette" data-cassette-index="${index}" style="--stack-order:${index + 1};">
      <img class="cassette__base" src="./Cassette.svg" alt="" aria-hidden="true" />
      <div class="cassette__label">${merchant.recordingLabel}</div>
    </article>
  `;
}

function renderCassettes() {
  cassetteOrbitEl.innerHTML = merchants
    .map((merchant, index) => createCassetteMarkup(merchant, index))
    .join("");
}

function getCassettePosition(index) {
  const distance = index - state.activeIndex;

  if (distance === 0) {
    return "cassette--center";
  }

  if (distance === 1) {
    return "cassette--right";
  }

  if (distance === -1) {
    return "cassette--left";
  }

  return distance > 1 ? "cassette--hidden-right" : "cassette--hidden-left";
}

function updateCassettePositions() {
  const cassetteEls = Array.from(cassetteOrbitEl.querySelectorAll(".cassette"));

  cassetteEls.forEach((cassetteEl) => {
    const cassetteIndex = Number(cassetteEl.dataset.cassetteIndex);
    cassetteEl.classList.remove(
      "cassette--left",
      "cassette--center",
      "cassette--right",
      "cassette--hidden-left",
      "cassette--hidden-right",
    );
    cassetteEl.classList.add(getCassettePosition(cassetteIndex));
  });
}

function setOrbitSpacing(value) {
  const spacing = `${value}px`;
  document.documentElement.style.setProperty("--orbit-spacing", spacing);
  orbitSpacingValueEl.textContent = spacing;
}

function render() {
  const active = merchants[state.activeIndex];
  const atStart = state.activeIndex === 0;
  const atEnd = state.activeIndex === merchants.length - 1;

  merchantNameEl.textContent = active.name;
  merchantCopyEl.innerHTML = renderCopy(active.copy);
  listenLabelEl.textContent = active.listenLabel;
  updateCassettePositions();

  prevButtonEl.disabled = atStart;
  prevButtonEl.setAttribute("aria-disabled", String(atStart));
  nextButtonEl.disabled = atEnd;
  nextButtonEl.setAttribute("aria-disabled", String(atEnd));

  navButtons.forEach((button, index) => {
    const isActive = index === active.iconIndex;
    button.classList.toggle("merchant-nav__icon--active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

renderCassettes();

prevButtonEl.addEventListener("click", () => {
  state.activeIndex = clamp(state.activeIndex - 1, 0, merchants.length - 1);
  render();
});

nextButtonEl.addEventListener("click", () => {
  state.activeIndex = clamp(state.activeIndex + 1, 0, merchants.length - 1);
  render();
});

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.activeIndex = Number(button.dataset.index);
    render();
  });
});

orbitSpacingSliderEl.addEventListener("input", (event) => {
  setOrbitSpacing(event.currentTarget.value);
});

setOrbitSpacing(orbitSpacingSliderEl.value);
render();
