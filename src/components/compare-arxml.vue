<template>
    <div class="compare">
        <div v-if="!isFile1 || !isFile2" style="display: flex;width: 100%;">
            <div style="width:50%;height:98%;position: relative;border:1px dotted">
                <div v-show="!isFile1" class="compare-btn-container">
                    <input type="file" id="file-upload" @change="onUpload({ type: 'compare1' })" ref="file1" style="display: none;" />
                    <button class="btn-upload-compare" @click="clickUpload({type : 'compare1'})">Click to upload file 1</button>
                </div>
                <div v-show="isFile1" class="selected">
                    <p class="file-name" tabindex="0">File Name: {{ file1 }}</p>
                    <input type="file" id="file-upload" @change="onUpload({ type: 'compare1' })" ref="file1" style="display: none;" />
                    <button class="btn-upload-compare" @click="clickUpload({type : 'compare1'})">Select another file</button>
                </div>
            </div>
            <div style="width:50%;height:98%;position: relative;border:1px dotted">
                <div v-show="!isFile2" class="compare-btn-container">
                    <input type="file" id="file-upload" @change="onUpload({ type: 'compare2' })" ref="file2" style="display: none;" />
                    <button class="btn-upload-compare" @click="clickUpload({type : 'compare2'})">Click to upload file 2</button>
                </div>
                <div v-show="isFile2" class="selected">
                    <p class="file-name" tabindex="0">File Name: {{ file2 }}</p>
                    <input type="file" id="file-upload" @change="onUpload({ type: 'compare2' })" ref="file2" style="display: none;" />
                    <button class="btn-upload-compare" @click="clickUpload({type : 'compare2'})">Select another file</button>
                </div>
            </div>
        </div>
        <div v-else style="width: 100%;">
            <div style="width: 100%;" v-for="(file,index) in compareFile1" :key="index">
                <CompareNode 
                    :node1="compareFile1[index].data" 
                    :ref="'AUTOSAR'" 
                    :node2="compareFile2[index].data"
                    />
            </div>
        </div>
    </div>
</template>

<script>
import ArxmlNode from './arxmlnode.vue';
import { mapGetters, mapActions } from "vuex";
import parser from "fast-xml-parser"
import CompareNode from './compare-node.vue'; 
import sortJsonArray from 'sort-json-array'


export default {
    name: "CompareArxml",

    components: {
        ArxmlNode,
        CompareNode
    },

    data(){
        return {
            file1:"",
            file2:"",
            reader: new FileReader(),
        }
    },

    computed: {
        ...mapGetters(["compareFile1", "compareFile2", "isFile1", "isFile2"])
    },

    methods: {
        ...mapActions(["addArxmlFile", "removeArxmlFile"]),
        onUpload: function ({type}) {
            let arxml
            if(type == 'compare1'){
                arxml = this.$refs.file1.files[0];
                this.file1 = arxml.name
                this.$refs.file1.value = ""
            }else{
                arxml = this.$refs.file2.files[0];
                this.file2 = arxml.name
                this.$refs.file2.value = ""
            }

            if (arxml.name.endsWith('.arxml')) {
               
                this.reader.onload = async (e) => {
                    const parserOptions = {
                        attributeNamePrefix: "@_",
                        ignoreAttributes: false,
                        ignoreNameSpace: false,
                        parseNodeValue: false,
                        parseAttributeValue: false
                    };
                    let streamJSON = {
                        "AUTOSAR": {
                            "AR-PACKAGES":{}
                        }
                    };
                    let arpackageJSON = parser.parse(e.target.result, parserOptions);
                    streamJSON['AUTOSAR']['AR-PACKAGES'] = arpackageJSON['AUTOSAR']['AR-PACKAGES'];
                    const convertToJson = async (node) => {
                        let comNode = []
                        let att = [];
                        if ('string' !== typeof (node)) {
                            let shortname = '';
                            let xpath;
                            let text = '';
                            
                            for (const key in node) {
                                let node_value = node[key];
                                
                                if (true === Array.isArray(node_value)) {
                                    for (let i = 0; i < node_value.length; i++) {
                                        
                                        // get shortname of node
                                        shortname = this.$func.getShortNameFromJsonObject(node_value[i]);
                                        
                                        // create xpath for child node
                                        xpath = `${key}[${i}]`;
                                        comNode.push({ "tag": key, "shortName": shortname, "xpath": xpath, selected: false, key: await convertToJson(node_value[i]) });
                                    }
                                }
                                else {
                                    
                                        // get attributes of node
                                        if (key.startsWith('@_')) {
                                            att.push([key.substring(2), node_value])
                                            continue;
                                        }
                                        
                                        // no need to display shortname seperately
                                        if ('SHORT-NAME' === key)
                                        continue;

                                        if (key.startsWith('#text'))
                                        continue;
                                        
                                        shortname = this.$func.getShortNameFromJsonObject(node_value);
                                        text = this.$func.getText(node_value)
                                        // create xpath for child node
                                        xpath = `${key}`;
                                        
                                        
                                    comNode.push({ "tag": key, "text": text, "shortName": shortname, "xpath": xpath, selected: false, att: att, key: await convertToJson(node_value) });
                                        
                                    }
                                    let sorted = sortJsonArray(comNode, 'shortName')
                                    comNode = sorted;
                                }
                            }
                            return comNode
                        };
                    let d = await convertToJson(streamJSON)
                    let tempData = { 'asd': arxml.type, 'filename': arxml.name, 'data': d };
                    this.addArxmlFile({data: tempData,type: type})
                    this.$vToastify.success("File Imported Successfully");
                    }
                this.reader.readAsText(arxml)
            } else {
                this.$vToastify.error("Invalid File Format");
            }
        },
        clickUpload: function ({type}) {
            if (type == 'compare1') this.$refs.file1.click()
            if (type == 'compare2') this.$refs.file2.click()
            
        },
    }
}
</script>

<style>
.compare {
    display: flex;
    height: 95vh;
    gap: 5px;
    margin: 0 10px;
}
.compare-btn-container{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}
.btn-upload-compare {
    text-align: center;
    font-size: 15px;
    background: #0000FF;
    font-weight: bold;
    color: white;
    padding: 10px 20px;
    border-radius: 10px;
    cursor: pointer;
    border: none;
}

.btn-upload-compare:hover {
    background: #0606aa;
}

.selected{
    font-size: 15px;
    font-weight: bold;
    text-align: center;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    height: 100%;
}
</style>