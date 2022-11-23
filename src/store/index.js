import Vue from 'vue'
import Vuex from 'vuex'

const { ipcRenderer }  = require('electron');

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    arxmlFiles :[],
    compareFile1 :[],
    compareFile2 :[],
  },

  getters: {
    allArxmlFiles  : state => state.arxmlFiles,
    arxmlFilesCount: state => state.arxmlFiles.length,
    hasArxmlFile : (state) => (file_path) => {
      return state.arxmlFiles.findIndex(arxmlFile => arxmlFile.path == file_path);
    },
    compareFile1: state => state.compareFile1,
    compareFile2: state => state.compareFile2,
    isFile1: state => state.compareFile1.length > 0 ? true : false,
    isFile2: state => state.compareFile2.length > 0 ? true : false,
  },
  
  actions: {
    async addArxmlFile({ commit }, {data = {},type} ) {   
      if(type == 'compare1'){
        commit('setCompareFile1', data);
      }else if(type == 'compare2'){
        commit('setCompareFile2', data);
      }else{
        commit('setArxmlFiles', data);
      }
    },
    async removeArxmlFile({ commit }, {file_index,type}) {
      if(type == 'compare1'){
        commit('removeCompare1', file_index);
      }else if(type == 'compare2'){
        commit('removeCompare2', file_index);
      }else{
        commit('removeArxmlFile', file_index)
      }
      commit('removeArxmlFile', file_index)
    },
  },
  
  mutations: {
    setArxmlFiles: (state, arxmlFile) => state.arxmlFiles = [arxmlFile],
    removeArxmlFile: (state, index,file)   => state.arxmlFiles.splice(index,1),
    setCompareFile1: (state,arxmlFile) => state.compareFile1 = [arxmlFile],
    setCompareFile2: (state,arxmlFile) => state.compareFile2 = [arxmlFile],
    removeCompare1: (state,index) => state.compareFile1.splice(index,1),
    removeCompare2: (state,index) => state.compareFile2.splice(index,1),
  }
})
