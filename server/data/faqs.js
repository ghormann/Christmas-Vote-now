// The Christmas display FAQ — the single copy, shared by vote-now.org and
// thehormanns.net (which pulls it from GET /faq).
//
// Answers are plain HTML strings. Anything that can change — dates, the song
// count, the address, charity names — is written as a {{token}} and filled in
// from data/facts.js at request time, so the text can never go stale.
//
// {{site}} is the base for links into thehormanns.net. Leave it as a token:
// thehormanns.net resolves it to "" so its own links stay relative.
//
// `audience` controls who shows the entry: "web" is thehormanns.net, "app" is
// the vote-now.org info page.

const ALL = ["web", "app"];

module.exports = [
  {
    id: "when-open",
    audience: ALL,
    question: "When is the Christmas light display open?",
    answer:
      "We open two days before Thanksgiving &mdash; {{openText}} this season &mdash; and run every night through New Year&rsquo;s Day, {{closeText}}. The show is on nightly from {{showHours}}."
  },
  {
    id: "location",
    audience: ALL,
    question: "Where is the display located?",
    answer:
      'We are at <a href="{{mapUrl}}">{{fullAddress}}</a>, about 25 minutes north of downtown Cincinnati, just off the Liberty Way exit of I-75.'
  },
  {
    id: "cost-to-visit",
    audience: ALL,
    question: "How much does it cost to visit?",
    answer:
      'Nothing. The display is completely free and there is no ticket or reservation. We do collect {{charityAccepts}} for {{charityBeneficiary}} in partnership with the <a href="{{charityPartnerUrl}}">{{charityPartner}}</a>, but donating is never required.'
  },
  {
    id: "hear-the-music",
    audience: ALL,
    question: "How do I hear the music?",
    answer:
      'Two ways. From your car, tune the radio to <strong>{{fm}}</strong> &mdash; the frequency is also shown on the <a href="{{site}}/technology/info-board/">information sign above the garage</a>. It is a low-power transmitter by design, so the signal only carries a few hundred feet; if you are not picking it up, move closer to the house. If you would rather get out and walk around, we also run <strong>outdoor speakers</strong> at the display, so you do not need a radio at all.'
  },
  {
    id: "radio-out-of-sync",
    audience: ALL,
    question: "Why is my car radio out of sync with the lights?",
    answer:
      "A few vehicles &mdash; newer Lexus and Cadillac models in particular &mdash; buffer the analog FM signal, which causes a noticeable delay. Some of those radios have a &ldquo;live mode&rdquo; option; turning it on fixes it. If you see one of us outside, ask &mdash; we usually have a portable radio in a pocket you can borrow."
  },
  {
    id: "show-length",
    audience: ALL,
    question: "How long is the show?",
    answer:
      'Songs play back to back continuously, so there is no set showtime to arrive for. The full playlist is currently <span data-show-stat="summary">{{showSummary}}</span>. Most visitors stay for three to five songs, but you are very welcome to settle in for the whole thing.'
  },
  {
    id: "stay-in-car",
    audience: ALL,
    question: "Can I stay in my car?",
    answer:
      "Yes. Most visitors watch from the street with the radio on, and that is the warmest way to do it. You are also welcome to get out and walk around &mdash; our outdoor speakers mean you can still hear the show away from your car."
  },
  {
    id: "light-tunnel",
    audience: ALL,
    question: "Can I walk through the light tunnel?",
    answer:
      'Yes. <a href="{{site}}/technology/tunnel/">The tunnel</a> is open to walk through, and there are buttons inside that let you change what it does. Visitors pressed them 39,661 times last season. If you get a good photo in there, we would love to see it &mdash; <a href="{{facebookUrl}}">share it with us on Facebook</a>.'
  },
  {
    id: "pick-next-song",
    audience: ALL,
    question: "Can I pick which song plays next?",
    answer:
      'Yes. From your phone, open <a href="{{interactUrl}}">vote-now.org</a> to <a href="{{site}}/technology/voting/">vote for the next song</a> and choose which <a href="{{site}}/technology/snowmen/">snowmen</a> appear in the display.'
  },
  {
    id: "name-in-lights",
    audience: ALL,
    question: "How do I get my name up in lights?",
    answer:
      'Text your first name to the number shown on the information sign and it will appear on the grid. Names are checked against a database of common first names, so an unusual spelling may take longer to appear. Names show below the clock within seconds and in the main display every 8&ndash;12 minutes, depending on the size of the queue. See <a href="{{site}}/technology/text-message/">how it works</a>.'
  },
  {
    id: "parking",
    audience: ALL,
    question: "Where should I park?",
    answer:
      "Please do not park directly in front of the traffic cones &mdash; they keep the lane clear. To watch from your car, park on the <strong>opposite side of the street from the house</strong>, or along <strong>Stonington Drive</strong>, which gives the best viewing distance from inside a car. If you would rather get out and walk around the display, park further up <strong>Devon Drive</strong> to stay clear of the traffic watching from their cars. Wherever you end up, please be considerate of our neighbors: do not block driveways, keep headlights and music down, and take your trash with you. Their patience is the only reason we have been able to keep this going."
  },
  {
    id: "best-time-to-visit",
    audience: ALL,
    question: "When is the best time to come to avoid traffic?",
    answer:
      'Traffic is generally lightest on school nights, and quietest between <strong>5:00 and 6:30</strong> or <strong>10:00 and 11:00</strong>. It gets heavier the closer you get to Christmas, and Christmas Eve is always very busy &mdash; that is the night the neighborhood gathers to watch the <a href="{{site}}/technology/clock/">countdown clock</a> hit zero. On the heaviest nights we switch to a shorter playlist to keep traffic moving.'
  },
  {
    id: "donations",
    audience: ALL,
    question: "Do you take donations?",
    answer:
      'Yes &mdash; for {{charityBeneficiary}}, not for us. There is a donation booth to the left of the display, open every night the show is on, that accepts {{charityAccepts}}. You can also give online through <a href="{{venmoUrl}}">Venmo</a> ({{charityTreasurer}} is the treasurer). <a href="{{site}}/christmas/giving/">See how much visitors have given</a>.'
  },
  {
    id: "setup-time",
    audience: ALL,
    question: "How long does the display take to set up?",
    answer:
      "We take two weeks off work in November to bring everything outside, mount it, and wire it together. In truth we work on the display year round &mdash; updating songs, building new elements, soldering, repairing, and configuring controllers."
  },
  {
    id: "sequencing-time",
    audience: ALL,
    question: "How long does it take to program one song?",
    answer:
      "It varies. The most complex songs take roughly an hour of sequencing for every 10 seconds of music &mdash; 20 to 24 hours for a four-minute song. There is a computer in our living room year round so any family member can sequence while relaxing."
  },
  {
    id: "running-cost",
    audience: ALL,
    question: "How much does it cost you to run?",
    answer:
      'The impact on our electric bill is relatively small since everything is LED &mdash; the <a href="{{site}}/christmas/">yearly stats</a> list the exact figure for each season. As for the electronics and hardware built up over the years, let us just say we could have bought a very nice new mini-van instead.'
  },
  {
    id: "neighbors",
    audience: ALL,
    question: "What do your neighbors think?",
    answer:
      "Our neighbors have been remarkably supportive over the years. Polite visitors are the single biggest reason we are able to keep the tradition going."
  },
  {
    id: "inside-the-house",
    audience: ALL,
    question: "Is the inside of your house full of lights too?",
    answer:
      "No. The inside is rather tame &mdash; the Christmas tree is mostly static lighting."
  },
  {
    id: "storage",
    audience: ALL,
    question: "Where do you store it all?",
    answer:
      "Our unfinished basement fills up with about fifty 27-gallon storage containers plus a wall of custom shelving for the small trees and yard stars. The larger items take up half the garage."
  },
  {
    id: "how-it-is-controlled",
    audience: ALL,
    question: "How do you control that many lights?",
    answer:
      'Every bulb is an individually addressable RGB pixel driven over <a href="{{site}}/technology/dmx/">E1.31 (sACN)</a> by pixel controllers, sequenced in <a href="https://xlights.org">xLights</a> and played back by <a href="https://github.com/FalconChristmas/fpp">FPP</a>. <a href="{{site}}/technology/">The technology section</a> walks through each piece.'
  }
];
