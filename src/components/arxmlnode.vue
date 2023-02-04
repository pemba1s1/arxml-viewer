<template>
    <li class="atomic-element">
        <table v-if="!Array.isArray(node)">
            <tr>
                <th>
                    <input 
                    type="checkbox"  
                    v-model="state.selected"
                    ref="checkbox"
                    style="display: none;"
                    >
                    <div v-if="state.selected" class="icon" @click="changeStateSelected">
                        <svg xmlns="http://www.w3.org/2000/svg" height="15px" width="15px" viewBox="0 0 448 512">
                            <path
                                d="M312 232C325.3 232 336 242.7 336 256C336 269.3 325.3 280 312 280H136C122.7 280 112 269.3 112 256C112 242.7 122.7 232 136 232H312zM0 96C0 60.65 28.65 32 64 32H384C419.3 32 448 60.65 448 96V416C448 451.3 419.3 480 384 480H64C28.65 480 0 451.3 0 416V96zM48 96V416C48 424.8 55.16 432 64 432H384C392.8 432 400 424.8 400 416V96C400 87.16 392.8 80 384 80H64C55.16 80 48 87.16 48 96z" />
                        </svg>
                    </div>
                    <div v-else class="icon" @click="changeStateSelected">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height="15px" width="15px">
                            <path
                                d="M200 344V280H136C122.7 280 112 269.3 112 256C112 242.7 122.7 232 136 232H200V168C200 154.7 210.7 144 224 144C237.3 144 248 154.7 248 168V232H312C325.3 232 336 242.7 336 256C336 269.3 325.3 280 312 280H248V344C248 357.3 237.3 368 224 368C210.7 368 200 357.3 200 344zM0 96C0 60.65 28.65 32 64 32H384C419.3 32 448 60.65 448 96V416C448 451.3 419.3 480 384 480H64C28.65 480 0 451.3 0 416V96zM48 96V416C48 424.8 55.16 432 64 432H384C392.8 432 400 424.8 400 416V96C400 87.16 392.8 80 384 80H64C55.16 80 48 87.16 48 96z" />
                        </svg>
                    </div>
                </th>
                <div @click="changeStateSelected" style="cursor:pointer">
                    <th>{{ title }}</th>
                    <th v-if="nodeText" class="atomic-shortname" tabindex="0" ref="shortname">{{ nodeText  }}</th>
                    <th v-if="!isNotPrimitive(node)" class="atomic-shortname" tabindex="0" ref="shortname">{{ node }}</th>
                </div>
            </tr>
        </table>
        <ul :style="`padding-left: ${ !Array.isArray(node) ? '25px' : '0' };`">
            <li v-if="state.selected">
                <table>
                    <tr v-for="(attr,index) in nodeAttributes" :key="index">
                        <th>{{attr[0]}}</th>
                        <th>{{attr[1]}}</th>
                    </tr>
                </table>
            </li>
            <template v-if="isNotPrimitive(node)" v-for="(child,index) in node">
                <!-- {{child}} -->
               
                <keep-alive :key="index">
                    <ArxmlNode 
                        v-if="state.selected && !index.toString().startsWith('@_') && index!='SHORT-NAME' && !nodeText"
                        :fileindex="fileindex" 
                        :node="child"
                        :nodeTag="index"
                        :length="child.length"
                        :autoopen="Array.isArray(node) ? false : true"
                    ></ArxmlNode>  
                    
                </keep-alive>
            </template>
        </ul>      
    </li>
</template>

<script>
import {mapGetters, mapActions} from "vuex";
import DownIcon from '../assets/chevron-down.svg'
import RightIcon from '../assets/chevron-right.svg'
import sortJsonArray from 'sort-json-array'

export default {
    name: "ArxmlNode",
    props: ['fileindex', 'node', 'nodeTag', 'idx', 'autoopen'],
    components:{
        DownIcon,
        RightIcon,
    },
    data: function() {
        return {
            nodeAttributes:[],
            nodeChildren : [],
            title: this.node['SHORT-NAME'] ? this.node['SHORT-NAME'] : this.nodeTag,
            nodeText: this.node['#text'] ? this.node['#text'] : null,
            state: { 
                selected: this.autoopen,
            },
        };
    },
    computed: {
        ...mapGetters(["allArxmlFiles"]),
    },
    methods: {
        ...mapActions(["removeArxmlFile"]),
        changeStateSelected(){
            this.$refs.checkbox.click();
        },
        debug(f){
            console.log(f)
        },
        isText(index){
            return index.toString().startsWith('#text')
        },
        isNotPrimitive(child){
            return 'string' !== typeof(child) && 'number' !== typeof(child) && 'boolean' !== typeof(child)
        }
    },
    created: async function(){
        
    }

}
</script>

<style>
.atomic-element > table {
    justify-content: center;
    align-items: center;
}

.atomic-shortname {
    margin-left: 10px;
    font-size: 10pt;
    color: darkolivegreen;
}

ul > li:not(.atomic-element) > table th {
    font-size: 8pt;
    font-weight: normal;
    padding: 0px 10px 0px 0px;
}

ul > li:not(.atomic-element) > table th:first-child  {
    color: midnightblue;
    font-weight:bold;
}

.icon{
    height:20px;
    width: 20px;
    cursor: pointer;
}

</style>
