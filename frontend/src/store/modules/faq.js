const state = {
  faqs: [
    {
      id: "A1",
      id2: "B1",
      question: "How long does this take to setup?",
      answer:
        "We take two weeks off work in November to bring all the components outside, mount them, and wire everything together.  We actually work on the display all year around: updating songs, building elements, soldering, fixing broken elements, configuring hardware controllers, etc."
    },
    {
      id: "A2",
      id2: "B2",
      question: "How long does it take to sequence on song so the lights and music match?",
      answer:
        "It varies.  The most complex songs take about a hour of sequencing for every 10 seconds of music. There is a computer sitting in our living room year around for each family member to do some sequencing while relaxing. (Mom does all the hard songs where the mouths move to the lyrics.)"
    },
    {
      id: "A3",
      id2: "B3",
      question: "How much does it cost you to do this?",
      answer:
        "The impact on our electric bill is relativity small as we are using all LED light bulbs. ($100 for the year.)  For everything we've invested over the last 20 years, lets just say we could have purchased a very nice new car by now..."
    },
    {
      id: "A3.1",
      id2: "B3.1",
      question: "Do you take donations?",
      answer:
        "No.  We have a lot of fun doing this each year and get the joy out of making others happy.  There are plenty of worthy charities that would make better use of the money. Please consider donating to one of them."
    },
    {
      id: "A4",
      id2: "B4",
      question: "What do your neighbors think?",
      answer: "Our neighbors have been very supportive though the years. Having polite visitors is key for our ability to continue the tradition!"
    },
    {
      id: "A5",
      id2: "B5",
      question: "Is the inside of your house filled with lights?",
      answer: "Nope.  The inside of our house is rather tame this time of year."
    },
    {
      id: "A6",
      id2: "B6",
      question: "Where do you store everything?",
      answer:
        "We have an unfinished basement that will fill up with storage containers.  The larger items fill up one 1/2 of the garage."
    }
  ]
};
const getters = {
  allFaqs: state => state.faqs
};

export default {
  state,
  getters
};