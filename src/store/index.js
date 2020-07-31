import Vue from 'vue'
import Vuex from 'vuex'

import ibps from './modules/ibps'
import shared_operation from './modules/shared_operation'
import getters from './getters'

Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    ibps,
    shared_operation
  },
  getters
})

