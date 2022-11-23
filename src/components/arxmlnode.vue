<template>
    <li class="atomic-element">
        <table>
            <tr>
                <th>
                    <input 
                    type="checkbox"  
                    v-model="state.selected"
                    ref="checkbox"
                    style="display: none;"
                    >
                    <div v-if="state.selected" class="icon" @click="changeStateSelected">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </div>
                    <div v-else class="icon" @click="changeStateSelected">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </div>
                </th>
                <div @click="changeStateSelected" style="cursor:pointer">
                    <th v-if="nodeText || !nodeShortName" class ="atomic-tag">{{ nodeTag}}</th>
                    <th 
                        v-else
                        class ="atomic-shortname" 
                        tabindex="0"
                        ref="shortname"
                    >{{ nodeShortName }}</th>
                    <th v-if="nodeText" class="atomic-shortname" tabindex="0" ref="shortname">{{ nodeText}}</th>
                </div>
            </tr>
        </table>
        <ul>
            <li v-if="state.selected">
                <table>
                    <tr v-for="(attr,index) in nodeAttributes" :key="index">
                        <th>{{attr[0]}}</th>
                        <th>{{attr[1]}}</th>
                    </tr>
                </table>
            </li>
            <template v-for="(child,index) in nodeChildren">
                <!-- {{child}} -->
                <keep-alive :key="index">
                    <ArxmlNode 
                        v-if="state.selected"
                        :fileindex="fileindex" 
                        :node="child.node"
                        :nodeShortName="child.shortName"
                        :nodeTag="child.tag" 
                        :ref="child.xpath"
                        :nodeText="child.text"
                        :length="nodeChildren.length"
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
    props: ['fileindex', 'node', 'nodeTag', 'nodeShortName', 'nodeText','length'],
    components:{
        DownIcon,
        RightIcon,
    },
    data: function() {
        return {
            nodeAttributes:[],
            nodeChildren : [],
            state: { 
                selected:  this.length === 1 ? true : false,
            },
        };
    },
    computed: {
        ...mapGetters(["allArxmlFiles"])
    },
    methods: {
        ...mapActions(["removeArxmlFile"]),
        changeStateSelected(){
            this.$refs.checkbox.click();
        }
    },
    created: async function(){
        if('string' !== typeof(this.node))
        {
            let shortname = '';
            let xpath;
            let text='';
            for(const key in this.node){
                let node_value = this.node[key];
                if(true === Array.isArray(node_value))
                {
                    for(let i=0; i<node_value.length; i++){
            
                        // get shortname of node
                        shortname = this.$func.getShortNameFromJsonObject(node_value[i]);
            
                        // create xpath for child node
                        xpath = `${key}[${i}]`;
            
                        this.nodeChildren.push(  {"tag":key, "shortName":shortname, "xpath": xpath, "node":node_value[i]} );            
                    }
                }
                else
                {
                
                    // get attributes of node
                    if(key.startsWith('@_')){
                        this.nodeAttributes.push( [key.substring(2) ,node_value] );
                        continue;
                    }
                    
                    // no need to display shortname seperately
                    if('SHORT-NAME' === key)
                        continue;

                    if(key.startsWith('#text'))
                        continue;

                    shortname = this.$func.getShortNameFromJsonObject(node_value);
                    text = this.$func.getText(node_value);
                    // create xpath for child node
                    xpath = `${key}`;
        
                    this.nodeChildren.push({ "tag": key, "text": text, "shortName":shortname, "xpath": xpath, "node": node_value});        

                }

                let sorted = sortJsonArray(this.nodeChildren, 'shortName')
                this.nodeChildren = sorted;      
            } 
        }
    }

}
</script>

<style>

.atomic-element > table {
    word-break: keep-all;
    white-space: nowrap;
}

.atomic-tag {
    color: darkred;
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