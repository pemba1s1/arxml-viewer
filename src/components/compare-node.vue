<template>
    <Noder :comNode1="comparedFile1" :comNode2="comparedFile2" p="0"/>
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
        ...mapGetters(["comparedFile1","comparedFile2"])
    },
    methods: {
        ...mapActions(["addCompared"]),
    },
    created: async function () {

        const compareNodes = async ({node1,node2}) => {
            let i = 0;
            let newNode1 = node1, newNode2 = node2;
            for (const i in newNode1) {
                if (Array.isArray(newNode1[i]) || Array.isArray(newNode2[i])){
                    const tempRes = await compareNodes({ node1: newNode1[i], node2: newNode2[i] });
                    newNode1[i] = tempRes.newNode1;
                    newNode2[i] = tempRes.newNode2;
                    continue;
                } else if('string' === typeof(newNode1[i]) || 'number' === typeof(newNode1[i]) || 'boolean' === typeof(newNode1[i])){
                    continue;
                }
                if(i>=node2.length){
                    newNode2.push({ "change": true });
                }
                if ((newNode1[i] && newNode2[i]) && newNode1[i]['SHORT-NAME'] == newNode2[i]['SHORT-NAME']){
                    if (newNode1[i] || newNode2[i]) {
                        const tempRes = await compareNodes({ node1: newNode1[i], node2: newNode2[i] });
                        newNode1[i] = tempRes.newNode1;
                        newNode2[i] = tempRes.newNode2;
                        
                        if (newNode1[i].change || newNode1[i].hasChanges || newNode1[i].dif) {
                            console.log(newNode1)
                            newNode1.hasChanges = true;
                        }
                    
                        if (newNode2[i].change || newNode2[i].hasChanges || newNode2[i].dif) {
                            newNode2[i].hasChanges = true;
                        }
                        
                        
                    }
                } else if ((newNode1[i] && newNode2[i]) && newNode1[i]['SHORT-NAME'] < newNode2[i]['SHORT-NAME']){
                    if(Array.isArray(newNode2)){
                        newNode2.splice(i, 0, { "change": true});
                    }else {
                        newNode2[i].change = true
                    }
                } else if ((newNode1[i] && newNode2[i]) && newNode1[i]['SHORT-NAME'] > newNode2[i]['SHORT-NAME']){
                    
                    if(Array.isArray(newNode1)){
                        newNode1.splice(i, 0, { "change": true });
                    }else {
                        newNode1[i].change = true
                    }
                }
            }
            const diff = newNode2.length - newNode1.length;
            for(let i = 0;i<diff;i++){
                newNode1.push({ "change": true });
            }

            return { newNode1, newNode2 };
        }
        const result = await compareNodes({node1:this.node1,node2:this.node2});
        console.log(result)
        this.addCompared({data:result});
        // this.comNode2 = result.newNode2;
    }

}
</script>

<style>

li{
    list-style: none;
}
</style>