//import axios from 'axios';

const state = {
  availSongs: [
    {
      id: 1,
      title: "Dance of the Sugar Plum Fairy",
      votes: 3
    },
    {
      id: 2,
      title: "EDM Carol of the Bells",
      votes: 0
    },
    {
      id: 3,
      title: "I Want a Hippopotamus for Christmas",
      votes: 0
    },
    {
      id: 4,
      title: "House on Christmas Street",
      votes: 0
    },
    {
      id: 5,
      title: "Light of Christmas",
      votes: 0
    },
    {
      id: 6,
      title: "12 Days of Christmas",
      votes: 0
    },
    {
      id: 7,
      title: "Jingle Dogs",
      votes: 0
    },
    {
      id: 8,
      title: "I heard the bells on Christmas Day",
      votes: 0
    },
    {
      id: 9,
      title: "Little Drummer Boy",
      votes: 0
    },
    {
      id: 10,
      title: "Amazing Grace",
      votes: 0
    },
    {
      id: 11,
      title: "Christmas Minions",
      votes: 0
    },
    {
      id: 12,
      title: "Here comes Santa Claus",
      votes: 0
    },
    {
      id: 13,
      title: "Christmas Cannon",
      votes: 0
    }
  ],
  oldSongs: [
    {
      id: 3,
      title: "Old song"
    },
    {
      id: 4,
      title: "Another old song"
    }
  ], 
  nameQueue: [
    {
      id: 1,
      name: "Greg"
    },
    {
      id: 2,
      name: "Matt"
    }
  ]
};

const getters = {
  allAvailSongs: state => state.availSongs,
  allOldSongs: state => state.oldSongs,
  allNames: state => state.nameQueue
};

const actions = {};

const mutations = {};

export default {
  state,
  getters,
  actions,
  mutations
};
