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
                    <th v-if="nodeText || !nodeShortName">{{ nodeTag}}</th>
                    <th 
                        v-else
                        tabindex="0"
                        ref="shortname"
                    >{{ nodeShortName }}</th>
                    <th v-if="nodeText" class="atomic-shortname" tabindex="0" ref="shortname">{{ nodeText}}</th>
                </div>
            </tr>
        </table>
        <ul style="padding-left:25px;">
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