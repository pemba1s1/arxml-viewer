<template>
  <div id="app" class="accordion">
    <div class="mode">
      <div>
        Mode : 
        <select v-model="mode">
          <option>View</option>
          <option>Compare</option>
        </select>
      </div>
      <div><button class="btn" @click="refresh">Refresh</button></div>
    </div>
    <article v-if="mode=='View'" class="accordion-item accordion-active" data-actab-id="0">
      <DropZone></DropZone>  
    </article>
    <article v-if="mode=='Compare'">
      <CompareArxml></CompareArxml>
    </article>
  </div>
</template>

<script>
import DropZone from './components/dropzone.vue';
import CompareArxml from './components/compare-arxml.vue'
import { mapActions } from "vuex";

export default {
  name: 'App',
  components: {
    DropZone,
    CompareArxml
  },
  data() {
    return{
      mode:'View'
    }
  },
  methods: {
    ...mapActions(["removeArxmlFile", "setArxmlFiles"]),
    refresh(){
      this.$winRe();
    }
  },
}
</script>

<style>
* {
    font-family: monospace;
    box-sizing: border-box;
    font-size: 13px;
}

html, body{
    height: 100%;
    padding: 0;
    margin : 0;
    background: white;
}

ul {
    list-style-type: none;
}

.accordion{
    height: inherit;
    margin: 0;
}

.accordion-tabs{
    position: fixed;
    right: 3%;
    top: 2%;
}

.accordion-tab {
    border: 0;
    padding: 3px;
    background: antiquewhite;
}

.accordion-tab-active {
    background: rgb(252, 215, 161);
}

.accordion-item{
    height: 95vh;
    display: none;
    overflow: auto;
}
.accordion-active{
    display: block;
}

.mode{
  height:5vh;
  font-size: 18px;
  width: 100%;
  justify-content: space-between;
  font-weight: bold;
  display: flex;
  align-items: center;
  padding-left: 15px;
  position: fixed;
  top:0;
  background: white;
}

.mode button{
  margin-right: 10px;
}

.btn{
  font-size: 15px;
  width: 100px;
  cursor: pointer;
}

#app{
  padding-top: 5vh;
}

</style>
