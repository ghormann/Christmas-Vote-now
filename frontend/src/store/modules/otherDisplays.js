import axios from "axios";

const state = {
  others: [],
};

const getters = {
  otherDisplays: (state) => state.others,
};
const actions = {
  async fetchOtherDisplays({ commit }) {
    let r = await axios.get("https://cooldisplays.net/favoriteJson.php?u=4bc62e8f4304ef2058dd7bc867a38d55i85i3863e180845856d92dfbe72016bbbb2cab68f9b8");
    commit("setOthers", r.data);
  },
};

const mutations = {
  setOthers: (state, input) => {
    state.others = input.displays;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
