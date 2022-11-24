<template>
    <!-- <div v-if="comNode">

        {{comNode}}
    </div> -->
    <Noder :comNode1="comNode1" :comNode2="comNode2"/>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Noder from '../components/node.vue'

export default {
    name: "CompareNode",
    props: ['node1', 'node2'],
    components:{
        Noder
    },
    
    data: function () {
        return {
            comNode1: '',
            comNode2:'',
        };
    },
    computed: {
        ...mapGetters(["allArxmlFiles"])
    },
    methods: {
        ...mapActions(["removeArxmlFile"]),
    },
    created: async function () {        

        const compareNodes = async ({node1,node2}) => {
            let i = 0;
            let newNode1 = node1, newNode2 = node2;
            while (i < newNode1.length){
                if (Array.isArray(newNode1[i]) || Array.isArray(newNode2[i])){
                    i++;
                    continue;
                }
                if(i>=node2.length){
                    newNode2.push({ "xpath": "", "key": [], "change": true, "selected": false });
                }
                if (newNode1[i].tag == newNode2[i].tag && newNode1[i].text != newNode2[i].text){
                    newNode1[i].dif = true;
                    newNode2[i].dif = true;
                } else if (newNode1[i].tag == newNode2[i].tag && newNode1[i].shortName == newNode2[i].shortName){
                    if (newNode1[i].key.length > 0 || newNode2[i].key.length > 0) {
                        const tempRes = await compareNodes({ node1: newNode1[i].key, node2: newNode2[i].key });
                        newNode1[i].key = tempRes.newNode1;
                        newNode2[i].key = tempRes.newNode2;
                        let j = 0
                        while (j < newNode1[i].key.length) {
                            if (newNode1[i].key[j].change || newNode1[i].key[j].hasChanges || newNode1[i].key[j].dif) {
                                newNode1[i].hasChanges = true;
                            }
                            j++;
                        }
                        j = 0
                        while (j < newNode2[i].key.length) {
                            if (newNode2[i].key[j].change || newNode2[i].key[j].hasChanges || newNode2[i].key[j].dif) {
                                newNode2[i].hasChanges = true;
                            }
                            j++;
                        }
                    }
                } else if (newNode1[i].tag < newNode2[i].tag || newNode1[i].shortName < newNode2[i].shortName){
                    newNode2.splice(i, 0, { "xpath": "", "key": [], "change": true, "selected": false });
                } else if (newNode1[i].tag > newNode2[i].tag || newNode1[i].shortName > newNode2[i].shortName){
                    newNode1.splice(i, 0, { "xpath": "", "key": [], "change": true, "selected": false });
                }
                i++;
            }
            const diff = newNode2.length - newNode1.length;
            for(let i = 0;i<diff;i++){
                newNode1.push({ "xpath": "", "key": [], "change": true, "selected": false });
            }

            return { newNode1, newNode2 };
        }
        const result = await compareNodes({node1:this.node1,node2:this.node2});
        this.comNode1 = result.newNode1;
        this.comNode2 = result.newNode2;
    }

}
</script>

<style>

li{
    list-style: none;
}
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