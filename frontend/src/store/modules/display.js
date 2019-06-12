//import axios from 'axios';

const state = {
    songs: [
        {
            id: 1,
            title: "Song 1",
            votes: 3
        },
        {
            id: 2,
            title: "Song 2",
            votes: 0
        }
    ]
};

const getters = {
    allSongs: state => state.songs
};

const actions = {};

const mutations = {};

export default {
    state,
    getters,
    actions,
    mutations
}