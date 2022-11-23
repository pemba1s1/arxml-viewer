<template>
    <div>
        <div v-for="(node, index) in comNode1" :key="index" style="width: 100%;margin: 0;">
            <div style="display:flex;width: 100%;gap:20px">
                <li :style="(node.change || comNode2[index].change) ? 'border:2px solid blue;margin-bottom:3px' : (node.hasChanges || comNode2[index].hasChanges) ? 'border:2px solid yellow ':(node.dif) && 'border:2px solid red'" style="width:50%;overflow-x: auto;"
                class="atomic-element">
                <!-- {{comNode1}} -->
                <div v-if="index==0">
                    <ul v-for="(att,index) in node.att" :key="att+index">
                        <li>
                            <table>
                                <tr>
                                    <th>{{att[0]}}</th>
                                    <th>{{att[1]}}</th>
                                </tr>
                            </table>
                        </li>
                    </ul>
                </div>
                    <table>
                        <tr>
                            <th>
                                <!-- <input type="checkbox" v-model="selected" ref="checkbox" style="display: none;"> -->
                                <div v-if="node.selected && comNode2[index].selected" class="icon" @click="changeStateSelected(node, comNode2[index])">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                        class="feather feather-chevron-down">
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </div>
                                <div v-else class="icon" @click="changeStateSelected(node, comNode2[index])">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                        class="feather feather-chevron-right">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </div>
                            </th>
                            <div @click="changeStateSelected(node, comNode2[index])" style="cursor:pointer;">
                                <th v-if="node.text || !node.shortName" class="atomic-tag">{{ node.tag }}</th>
                                <th v-else class="atomic-shortname" tabindex="0" ref="shortname">{{node.text}}{{node.shortName}}</th>
                                <th v-if="node.text" class="atomic-shortname" tabindex="0" ref="shortname">{{node.text}}</th>
                            </div>
                        </tr>
                    </table>
                </li>
                <li :style="(node.change || comNode2[index].change) ? 'border:2px solid blue;margin-bottom:3px' : (node.hasChanges || comNode2[index].hasChanges) ? 'border:2px solid yellow ' : (node.dif) && 'border:2px solid red'" style="width:50%;overflow-x: auto;"
                    class="atomic-element">
                    <div v-if="index==0">
                        <ul v-for="(att,index) in comNode2[index].att" :key="att+index">
                            <li>
                                <table>
                                    <tr>
                                        <th>{{att[0]}}</th>
                                        <th>{{att[1]}}</th>
                                    </tr>
                                </table>
                            </li>
                        </ul>
                    </div>
                    <table>
                        <tr>
                            <th>
                                <!-- <input type="checkbox" v-model="comNode2[index].selected" ref="checkbox" style="display: none;"> -->
                                <div v-if="node.selected && comNode2[index].selected" class="icon" @click="changeStateSelected(node,comNode2[index])">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                        class="feather feather-chevron-down">
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </div>
                                <div v-else class="icon" @click="changeStateSelected(node,comNode2[index])">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                        class="feather feather-chevron-right">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </div>
                            </th>
                            <div @click="changeStateSelected(node,comNode2[index])" style="cursor:pointer">
                                <th v-if="comNode2[index].text || !comNode2[index].shortName" class="atomic-tag">{{ comNode2[index].tag }}</th>
                                <th v-else class="atomic-shortname" tabindex="0" ref="shortname">{{ comNode2[index].shortName }}</th>
                                <th v-if="comNode2[index].text" class="atomic-shortname" tabindex="0" ref="shortname">{{ comNode2[index].text}}</th>
                            </div>
                        </tr>
                    </table>
                </li>
            </div>
            <Noder v-if="node.selected && comNode2[index].selected" :comNode1="node.key" :comNode2="comNode2[index].key"
                style="padding-left:15px"/>

        </div>
    </div>
</template>
<script>

export default{
    name: 'Noder',
    props: ['comNode1','comNode2'],
    created: function (){
        if(this.comNode1.length < this.comNode2.length){
            let diff = this.comNode2.length - this.comNode1.length
            for(let i =0;i<diff;i++){
                this.comNode1.push({ "xpath": "", "key": [], "change": true, "selected": false })
            }
        }else if(this.comNode1.length > this.comNode2.length){
            let diff = this.comNode1.length - this.comNode2.length
            for (let i = 0; i < diff; i++) {
                this.comNode2.push({ "xpath": "", "key": [], "change": true, "selected": false })
            }
        }
        if(this.comNode1.length === 1){
            this.comNode1[0].selected = true;
        }
        if (this.comNode2.length === 1) {
            this.comNode2[0].selected = true;
        }
    },
    methods: {
        changeStateSelected(node1,node2) {
            node1.selected = !node1.selected;
            node2.selected = !node2.selected;
        }
    },
}
</script>

<style>
.atomic-element>table {
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

ul>li:not(.atomic-element)>table th {
    font-size: 8pt;
    font-weight: normal;
    padding: 0px 10px 0px 0px;
}

ul>li:not(.atomic-element)>table th:first-child {
    color: midnightblue;
    font-weight: bold;
}

.icon {
    height: 20px;
    width: 20px;
    cursor: pointer;
}
</style>