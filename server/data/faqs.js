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
      "We open two days before Thanksgiving ({{openText}} this season) and run every night through New Year&rsquo;s Day, {{closeText}}. The show is on nightly from {{showHours}}."
  },
  {
    id: "location",
    audience: ["web"],
    question: "Where is the display located?",
    answer:
      'We are at <a href="{{mapUrl}}">{{fullAddress}}</a>, about 25 minutes north of downtown Cincinnati, just off the Liberty Way exit of I-75.'
  },
  {
    id: "cost-to-visit",
    audience: ALL,
    question: "How much does it cost to visit?",
    answer:
      'Nothing. The display is free, and there are no tickets or reservations. We do collect {{charityAccepts}} for {{charityBeneficiary}} in partnership with the <a href="{{charityPartnerUrl}}">{{charityPartner}}</a>, but donating is never required.'
  },
  {
    id: "hear-the-music",
    audience: ALL,
    question: "How do I hear the music?",
    answer:
      'Two ways. From your car, tune the radio to <strong>{{fm}}</strong>. It is a low-power transmitter by design, so the signal only carries a few hundred feet. If you are not picking it up, move closer to the house. If you would rather get out and walk around, we also run <strong>outdoor speakers</strong> at the display, so you do not need a radio at all.'
  },
  {
    id: "radio-out-of-sync",
    audience: ALL,
    question: "Why is my car radio out of sync with the lights?",
    answer:
      "Some newer cars (Lexus and Cadillac in particular) buffer the FM signal, which puts the audio slightly behind the lights. If your radio has a &ldquo;live mode&rdquo; option, turning it on fixes it. If that doesn't work and you see one of us outside, just ask. We usually have a portable radio you can borrow."
  },
  {
    id: "show-length",
    audience: ALL,
    question: "How long is the show?",
    answer:
      'Songs play back to back, so there&rsquo;s no set showtime to catch. The full playlist is currently <span data-show-stat="summary">{{showSummary}}</span>. Most visitors stay for three to five songs, but you are very welcome to settle in for the whole thing.'
  },
  {
    id: "stay-in-car",
    audience: ALL,
    question: "Can I stay in my car?",
    answer:
      "Yes. Most visitors watch from the street with the radio on, and that is the warmest way to do it. You are also welcome to get out and walk around. The outdoor speakers mean you can still hear the show away from your car."
  },
  {
    id: "light-tunnel",
    audience: ALL,
    question: "Can I walk through the light tunnel?",
    answer:
      'Yes. <a href="{{site}}/technology/tunnel/">The tunnel</a> is open to walk through, and there are buttons just outside that let you change what it does. If you get a good photo in there, we&rsquo;d love to see it on <a href="{{facebookUrl}}">Facebook</a>.'
  },
  {
    id: "pick-next-song",
    audience: ALL,
    question: "Can I pick which song plays next?",
    answer:
      'Yes. Open <a href="{{interactUrl}}">vote-now.org</a> on your phone and vote for the songs you want to hear. The songs with the most votes move up the list. Curious how it works? <a href="{{site}}/technology/voting/">Here&rsquo;s how we built it</a>.'
  },
  {
    id: "how-voting-works",
    audience: ["app"],
    question: "How does voting work?",
    answer:
      "Each phone gets {{maxVotes}} votes. Tap the up arrow next to a song to vote for it, and tap the down arrow to take a vote back. You can put more than one vote on the same song, and a &#9733; shows how many of your votes are on each song. The song at the top of the list plays next. Once it plays, it moves to Recently Played for a while, and any votes you had on it come back to you. You also earn one vote back every {{voteRefillMinutes}} minutes, up to {{maxVotes}}."
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
      "Please don't park in front of the traffic cones; they keep the lane open. To watch from your car, park on the <strong>opposite side of the street from the house</strong>, or along <strong>Stonington Drive</strong>, which gives the best view from inside a car. If you would rather get out and walk around the display, park further up <strong>Devon Drive</strong> so you're out of the way of the cars watching. Wherever you end up, please be considerate of our neighbors: do not block driveways, keep headlights and music down, and take your trash with you. They've put up with the traffic for decades, and we couldn't do this without them."
  },
  {
    id: "best-time-to-visit",
    audience: ALL,
    question: "When is the best time to come to avoid traffic?",
    answer:
      'Traffic is generally lightest on school nights, and quietest between <strong>5:00 and 6:30</strong> or <strong>10:00 and 11:00</strong>. It gets heavier the closer we get to Christmas. Christmas Eve is always very busy, because that&rsquo;s the night the neighborhood gathers to watch the <a href="{{site}}/technology/clock/">countdown clock</a> hit zero. On the heaviest nights we switch to a shorter playlist to keep traffic moving.'
  },
  {
    id: "donations",
    audience: ALL,
    question: "Do you take donations?",
    answer:
      'Yes, for {{charityBeneficiary}}. There is a donation booth to the left of the display, open every night the show is on. We accept {{charityAccepts}}. You can also give online through <a href="{{venmoUrl}}">Venmo</a> ({{charityTreasurer}} is the treasurer). <a href="{{site}}/christmas/giving/">See how much visitors have given</a> in previous years. Thank you!'
  },
  {
    id: "setup-time",
    audience: ALL,
    question: "How long does the display take to set up?",
    answer:
      'We take two weeks off work in November to bring everything outside, mount it, and wire it together. The rest of the year goes to programming songs, building new pieces, soldering, and repairs. The <a href="{{site}}/christmas/">time-lapse videos</a> of setup show what it takes.'
  },
  {
    id: "sequencing-time",
    audience: ALL,
    question: "How long does it take to program one song?",
    answer:
      "It varies. The most complex songs take about an hour of sequencing for every 10 seconds of music, so a four-minute song can take 16 to 24 hours. We keep a computer in the living room all year so anyone in the family can work on a song while relaxing."
  },
  {
    id: "running-cost",
    audience: ALL,
    question: "How much does it cost you to run?",
    answer:
      'Less than you&rsquo;d think, since everything is LED. The <a href="{{site}}/christmas/">yearly stats</a> list the exact figure for each season. As for the electronics and hardware built up over the years, let us just say we could have bought a very nice new mini-van instead.'
  },
  {
    id: "neighbors",
    audience: ALL,
    question: "What do your neighbors think?",
    answer:
      "They've been great about it for a long time. Polite visitors help a lot, so thank you for being one."
  },
  {
    id: "inside-the-house",
    audience: ALL,
    question: "Is the inside of your house full of lights too?",
    answer:
      "No. The inside is rather tame. Believe it or not, the indoor Christmas tree is mostly static lighting."
  },
  {
    id: "storage",
    audience: ALL,
    question: "Where do you store it all?",
    answer:
      "Our unfinished basement fills up with about fifty 27-gallon storage containers as well as two walls of custom shelving for the small trees and yard stars. The larger items take up half the garage on custom shelving."
  },
  {
    id: "how-it-is-controlled",
    audience: ALL,
    question: "How do you control that many lights?",
    answer:
      'Every bulb is an individually addressable RGB pixel driven over <a href="{{site}}/technology/dmx/">E1.31 (sACN)</a> by pixel controllers, sequenced in <a href="https://xlights.org">xLights</a> and played back by <a href="https://github.com/FalconChristmas/fpp">FPP</a>. The <a href="{{site}}/technology/">technology pages</a> explain how the different parts of the display work.'
  }
];
