const state = {
  faqs: [
    {
      id: "A7",
      id2: "B7",
      question: "Why is my car radio  multiple seconds out of sync with the lights?",
      answer:
        "A few vehicles (newer Lexus, Cadillac's, and probably others) buffer the analog FM signal. This causes a noticeable delay.  Some of these radios support \"live mode\" as an option.  If yours does, try enabling it.  If you see one of us outside, we usually have a portable radio in our pocket. Ask you can borrow it."
    },
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
      question: "How long does it take to sequence one song so the lights and music match?",
      answer:
        "It varies.  The most complex songs take about a hour of sequencing for every 10 seconds of music (20-24 hrs for a less that 4 minute song). There is a computer sitting in our living room year around for each family member to do some sequencing while relaxing."
    },
    {
      id: "A3",
      id2: "B3",
      question: "How much does it cost you to do this?",
      answer:
        "The impact on our electric bill is relativity small as we are using all LED light bulbs. ($100 for the year.)  For everything we've invested over the last 20 years, lets just say we could have purchased a very nice new vehicle instead..."
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
      answer: "Our amazing neighbors have been very supportive though the years. Having polite visitors is key for our ability to continue the tradition!"
    },
    {
      id: "A5",
      id2: "B5",
      question: "Is the inside of your house filled with lights?",
      answer: "Nope.  The inside of our house is rather tame. The Christmas Tree is mostly static lighting."
    },
    {
      id: "A6",
      id2: "B6",
      question: "Where do you store everything?",
      answer:
        "We have an unfinished basement that becomes fill up with 50 27 gallon storage containers and a wall of custom shelving for the small trees and starts in the yard.  In addition, The larger items fill up one 1/2 of the garage."
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
