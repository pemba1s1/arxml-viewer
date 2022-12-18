<template>
    <div>
        <div v-for="(node, index) in comNode1" :key="index" style="width: 100%;margin: 0;">
            <div style="display:flex;width: 100%;justify-content: space-between;">
                <li style="width:48%;padding-right: 5px;overflow-x: auto;"
                class="atomic-element">
                <!-- {{comNode1}} -->
                    <div :style="`padding-left:${p}px;`">
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
                        <table style="width:100%">
                            <tr>
                                <th style="width:5%">
                                    <!-- <input type="checkbox" v-model="selected" ref="checkbox" style="display: none;"> -->
                                    <div v-if="node.selected && comNode2[index].selected" class="icon" @click="changeStateSelected(node, comNode2[index])">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="15px" width="15px"
                                            viewBox="0 0 448 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
                                            <path
                                                d="M312 232C325.3 232 336 242.7 336 256C336 269.3 325.3 280 312 280H136C122.7 280 112 269.3 112 256C112 242.7 122.7 232 136 232H312zM0 96C0 60.65 28.65 32 64 32H384C419.3 32 448 60.65 448 96V416C448 451.3 419.3 480 384 480H64C28.65 480 0 451.3 0 416V96zM48 96V416C48 424.8 55.16 432 64 432H384C392.8 432 400 424.8 400 416V96C400 87.16 392.8 80 384 80H64C55.16 80 48 87.16 48 96z" />
                                        </svg>
                                    </div>
                                    <div v-else class="icon" @click="changeStateSelected(node, comNode2[index])">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height="15px" width="15px">
                                            <path
                                                d="M200 344V280H136C122.7 280 112 269.3 112 256C112 242.7 122.7 232 136 232H200V168C200 154.7 210.7 144 224 144C237.3 144 248 154.7 248 168V232H312C325.3 232 336 242.7 336 256C336 269.3 325.3 280 312 280H248V344C248 357.3 237.3 368 224 368C210.7 368 200 357.3 200 344zM0 96C0 60.65 28.65 32 64 32H384C419.3 32 448 60.65 448 96V416C448 451.3 419.3 480 384 480H64C28.65 480 0 451.3 0 416V96zM48 96V416C48 424.8 55.16 432 64 432H384C392.8 432 400 424.8 400 416V96C400 87.16 392.8 80 384 80H64C55.16 80 48 87.16 48 96z" />
                                        </svg>
                                    </div>
                                </th>
                                <div 
                                    @click="changeStateSelected(node, comNode2[index])" 
                                    style="cursor:pointer;"
                                    :style="(node.change || comNode2[index].change) ? 'background:#8390f2;margin-bottom:3px' : (node.hasChanges || comNode2[index].hasChanges) ? 'background:yellow ' : (node.dif) && 'background:red'"
                                    >
                                    <th v-if="node.text || !node.shortName">{{ node.tag }}</th>
                                    <th v-else tabindex="0" ref="shortname">{{node.text}}{{node.shortName}}</th>
                                    <th v-if="node.text" class="atomic-shortname" tabindex="0" ref="shortname">{{node.text}}</th>
                                </div>
                            </tr>
                        </table>
                    </div>                
                </li>
                <div style="border-left:1px solid;border-right:1px solid;width:4%">
                    <div style="display:flex;padding:3px;width:100%;gap: 2px;" v-if="node.change || comNode2[index].change">
                        <div class="change-button" @click="swap(node, comNode2[index])">
                            <svg xmlns="http://www.w3.org/2000/svg" height="16px" width="16px" viewBox="0 0 448 512">
                                <path
                                    d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                            </svg>
                        </div>
                        <div class="change-button" @click="swap(node, comNode2[index])">
                            <svg xmlns="http://www.w3.org/2000/svg" height="16px" width="16px" viewBox="0 0 448 512">
                                <path
                                    d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <li style="width:48%;overflow-x: auto;padding-right: 5px;" class="atomic-element">
                    <div :style="`padding-left:${p}px`">
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
                        <table style="width:100%">
                            <tr>
                                <th style="width:5%">
                                    <!-- <input type="checkbox" v-model="comNode2[index].selected" ref="checkbox" style="display: none;"> -->
                                    <div v-if="node.selected && comNode2[index].selected" class="icon" @click="changeStateSelected(node,comNode2[index])">
                                        <!-- <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                            class="feather feather-chevron-down">
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg> -->
                                        <svg xmlns="http://www.w3.org/2000/svg" height="15px" width="15px"
                                            viewBox="0 0 448 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
                                            <path
                                                d="M312 232C325.3 232 336 242.7 336 256C336 269.3 325.3 280 312 280H136C122.7 280 112 269.3 112 256C112 242.7 122.7 232 136 232H312zM0 96C0 60.65 28.65 32 64 32H384C419.3 32 448 60.65 448 96V416C448 451.3 419.3 480 384 480H64C28.65 480 0 451.3 0 416V96zM48 96V416C48 424.8 55.16 432 64 432H384C392.8 432 400 424.8 400 416V96C400 87.16 392.8 80 384 80H64C55.16 80 48 87.16 48 96z" />
                                        </svg>
                                    </div>
                                    <div v-else class="icon" @click="changeStateSelected(node,comNode2[index])">
                                        <!-- <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                            class="feather feather-chevron-right">
                                            <polyline points="9 18 15 12 9 6"></polyline>
                                        </svg> -->
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height="15px" width="15px">
                                            <path
                                                d="M200 344V280H136C122.7 280 112 269.3 112 256C112 242.7 122.7 232 136 232H200V168C200 154.7 210.7 144 224 144C237.3 144 248 154.7 248 168V232H312C325.3 232 336 242.7 336 256C336 269.3 325.3 280 312 280H248V344C248 357.3 237.3 368 224 368C210.7 368 200 357.3 200 344zM0 96C0 60.65 28.65 32 64 32H384C419.3 32 448 60.65 448 96V416C448 451.3 419.3 480 384 480H64C28.65 480 0 451.3 0 416V96zM48 96V416C48 424.8 55.16 432 64 432H384C392.8 432 400 424.8 400 416V96C400 87.16 392.8 80 384 80H64C55.16 80 48 87.16 48 96z" />
                                        </svg>
                                    </div>
                                </th>
                                <div 
                                    @click="changeStateSelected(node,comNode2[index])" 
                                    style="cursor:pointer"
                                    :style="(node.change || comNode2[index].change) ? 'background:#8390f2;margin-bottom:3px' : (node.hasChanges || comNode2[index].hasChanges) ? 'background:yellow ' : (node.dif) && 'background:red'"
                                    >
                                    <th v-if="comNode2[index].text || !comNode2[index].shortName" >{{ comNode2[index].tag }}</th>
                                    <th v-else  tabindex="0" ref="shortname">{{ comNode2[index].shortName }}</th>
                                    <th v-if="comNode2[index].text" class="atomic-shortname" tabindex="0" ref="shortname">{{ comNode2[index].text}}</th>
                                </div>
                            </tr>
                        </table>
                    </div>
                </li>
            </div>
            <Noder v-if="node.selected && comNode2[index].selected" :comNode1="node.key" :comNode2="comNode2[index].key"
                :p="padding"/>

        </div>
    </div>
</template>
<script>

export default{
    name: 'Noder',
    props: ['comNode1','comNode2','p'],
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
    computed:{
        padding(){
            return parseInt(this.p) + 25;
        },
    },
    methods: {
        changeStateSelected(node1,node2) {
            node1.selected = !node1.selected;
            node2.selected = !node2.selected;
        },
        swap(node1,node2){
            
        }
    },
}
</script>

<style>
.atomic-element>table {
    word-break: keep-all;
    white-space: nowrap;
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

.change-button{
    border: 1px solid;
    width: 50%;
    padding: 1px 1px 0 1px;
    cursor: pointer;
}
</style>