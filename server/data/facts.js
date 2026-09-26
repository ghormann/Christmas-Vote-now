// Single source of truth for the facts that appear in the FAQ answers.
//
// The FAQ text in faqs.js is written with {{token}} placeholders; everything
// that fills one of those tokens lives here. Both vote-now.org and
// thehormanns.net render the same answers, so changing an address or an hour
// here changes it on both sites.

const datamodel = require("../model/datamodel.js");
const session = require("../lib/session.js");

// Greg started experimenting with animated displays in 2001, which we count as
// year one.
const FIRST_YEAR = 2000;

const DISPLAY = {
  name: "The Hormann Christmas Light Display",
  streetAddress: "6656 Devon Drive",
  addressLocality: "Liberty Township",
  addressRegion: "OH",
  postalCode: "45044",
  // Full Google Maps place URL; Google is retiring goo.gl short links.
  mapUrl: "https://www.google.com/maps/place/Christmas+@+the+Hormanns/@39.3953299,-84.3994264,18z/data=!4m5!3m4!1s0x88405b01adc3fe25:0xe69153dcc65684a9!8m2!3d39.395325!4d-84.3991475",
  interactUrl: "https://vote-now.org/",
  fmFrequency: "106.7 FM",
  // Update each season to match the year page on thehormanns.net.
  pixelCount: 75805,
  facebookUrl: "https://www.facebook.com/HormannChristmas"
};

const CHARITY = {
  partner: "Southwest Ohio Valley Women's Club",
  partnerUrl: "https://www.facebook.com/gfwcswohiovallleywomensclub",
  beneficiary: "local food banks",
  accepts: "non-perishable food, grocery gift cards, or cash",
  treasurer: "Verna"
};

const VENMO_URL = "https://account.venmo.com/u/Verna-Heaney";

const SHOW_HOURS_TEXT = "5:00 PM to 11:00 PM";

// Fallbacks used before the playlist has been loaded from FPP.
const SHOW_DEFAULTS = { songs: 28, minutes: 73 };

const fullAddress = `${DISPLAY.streetAddress}, ${DISPLAY.addressLocality}, ${DISPLAY.addressRegion} ${DISPLAY.postalCode}`;

// ---------------------------------------------------------------------------
// Season schedule
//
// The display opens two days before Thanksgiving (the Tuesday before) and runs
// nightly through January 1, so the dates are derived rather than typed in.
// ---------------------------------------------------------------------------

/** Thanksgiving Day (US): the fourth Thursday of November. */
function thanksgiving(year) {
  const nov1 = new Date(year, 10, 1);
  const firstThursday = 1 + ((4 - nov1.getDay() + 7) % 7);
  return new Date(year, 10, firstThursday + 21);
}

/** Opening night: two days before Thanksgiving. */
function seasonOpen(year) {
  return new Date(year, 10, thanksgiving(year).getDate() - 2);
}

/** Closing night: January 1 of the following year. */
function seasonClose(year) {
  return new Date(year + 1, 0, 1);
}

/** The moment the last night of the season ends (midnight after January 1). */
function seasonEnd(year) {
  const close = seasonClose(year);
  return new Date(close.getFullYear(), close.getMonth(), close.getDate() + 1);
}

/**
 * The season we should be talking about: the one currently running, or — once
 * a season has ended — the next one. January 1 still belongs to the previous
 * November's season.
 */
function currentSeasonYear(now) {
  const y = now.getFullYear();
  if (now < seasonEnd(y - 1)) return y - 1;
  return y;
}

/** Whether `now` falls between opening night and the end of January 1. */
function isInSeason(now) {
  const year = currentSeasonYear(now);
  return now >= seasonOpen(year) && now < seasonEnd(year);
}

const LONG_DATE = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric"
});

/** Live playlist size, falling back to last season's figures before boot. */
function showSize() {
  const songs = Array.isArray(datamodel.songs) ? datamodel.songs : [];
  if (songs.length === 0) return { ...SHOW_DEFAULTS };
  return {
    songs: songs.length,
    minutes: Math.round(
      songs.reduce((sum, s) => sum + (s.duration || 0), 0) / 60
    )
  };
}

/**
 * Every {{token}} the FAQ answers can use.
 *
 * `site` is the base URL that links into thehormanns.net are built from. A
 * consumer hosted on thehormanns.net passes an empty string so the links stay
 * relative; everyone else gets absolute URLs.
 */
function tokens({ site = "https://thehormanns.net", now = new Date() } = {}) {
  const year = currentSeasonYear(now);
  const size = showSize();

  return {
    site,
    years: String(year - FIRST_YEAR),

    openText: LONG_DATE.format(seasonOpen(year)),
    closeText: LONG_DATE.format(seasonClose(year)),
    showHours: SHOW_HOURS_TEXT,

    fullAddress,
    mapUrl: DISPLAY.mapUrl,
    fm: DISPLAY.fmFrequency,
    facebookUrl: DISPLAY.facebookUrl,
    interactUrl: DISPLAY.interactUrl,

    charityPartner: CHARITY.partner,
    charityPartnerUrl: CHARITY.partnerUrl,
    charityBeneficiary: CHARITY.beneficiary,
    charityAccepts: CHARITY.accepts,
    charityTreasurer: CHARITY.treasurer,
    venmoUrl: VENMO_URL,

    songCount: String(size.songs),
    showMinutes: String(size.minutes),
    showSummary: `${size.minutes} minutes of music across ${size.songs} songs`,

    maxVotes: String(session.MAX_VOTES),
    voteRefillMinutes: String(session.VOTE_REFILL_MINUTES)
  };
}

/** The display facts vote-now.org shows outside the FAQ (GET /facts). */
function publicFacts(now = new Date()) {
  const year = currentSeasonYear(now);
  return {
    seasonYear: year,
    years: year - FIRST_YEAR,
    inSeason: isInSeason(now),
    openText: LONG_DATE.format(seasonOpen(year)),
    closeText: LONG_DATE.format(seasonClose(year)),
    showHours: SHOW_HOURS_TEXT,
    pixelCount: DISPLAY.pixelCount,
    fm: DISPLAY.fmFrequency
  };
}

/** Substitute {{token}} placeholders, leaving unknown tokens untouched. */
function render(text, values) {
  return text.replace(/\{\{(\w+)\}\}/g, (match, key) =>
    Object.prototype.hasOwnProperty.call(values, key) ? values[key] : match
  );
}

module.exports = {
  DISPLAY,
  CHARITY,
  VENMO_URL,
  SHOW_HOURS_TEXT,
  fullAddress,
  currentSeasonYear,
  seasonOpen,
  seasonClose,
  isInSeason,
  showSize,
  publicFacts,
  tokens,
  render
};
