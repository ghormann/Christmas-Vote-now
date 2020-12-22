import axios from "axios";

const state = {
  others: [{ title: "Loading" }],
};

const getters = {
  otherDisplays: (state) => state.others,
};
const actions = {
  async fetchOtherDisplays({ commit }) {
    let r = await axios.get(
      "https://cooldisplays.net/favoriteJson.php?u=4bc62e8f4304ef2058dd7bc867a38d55i85i3863e180845856d92dfbe72016bbbb2cab68f9b8&lat=39.3953295&lng=-84.3991711"
    );
    commit("setOthers", r.data);
  },
};

const mutations = {
  setOthers: (state, input) => {
    state.others = input.displays;
    state.others.forEach(function(o) {
      o.musical=o.tags.includes("Synced to Music");
      o.distance = Math.round(o.distance * 100) / 100
      o.pict =
        "https://cooldisplays.net/picture.php?v=1608653961&width=300&display=" +
        o.displayid;
    });
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
