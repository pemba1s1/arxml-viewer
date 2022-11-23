<template>
    <div style="height:98%">
        <!-- <div v-if="allArxmlFiles.length > 0">

            {{allArxmlFiles[0].data['AUTOSAR']}}
        </div> -->
        <div 
            v-show="arxmlFilesCount == 0"
            id="file-container" 
        >
            <input type="file" id="file-upload" @change="onUpload" ref="file" style="display: none;"/>
            <div class="btn-container" >
                <button class="btn-upload" @click="clickUpload">Click To Upload</button>
            </div>
        </div>  
        <div class="file-viewer" v-for="(arxmlFile,index) in allArxmlFiles" :key="index">
            <div class="file-title">
                <span class="file-name" tabindex="0">File Name: {{ arxmlFile.filename }}</span>
                <span class="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" height="18px" width="18px" viewBox="0 0 512 512">
                        <path
                            d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.8 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
                    </svg>
                </span>
                <span class="icon" @click="removeArxmlFile({file_index:index})">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="red" height="18px" width="18px" viewBox="0 0 448 512">
                        <path
                            d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                    </svg>
                </span>
            </div>
            <ul>
                <ArxmlNode :fileindex="index" :node="arxmlFile.data['AUTOSAR']" nodeShortName="" nodeTag="AUTOSAR"
                    :ref="'AUTOSAR' + index"></ArxmlNode>
            </ul>
        </div>
    </div>
</template>

<script>
import ArxmlNode from './arxmlnode.vue';
import {mapGetters, mapActions} from "vuex";
import parser from "fast-xml-parser"

export default {
    name: "DropZone",

    components: {
        ArxmlNode
    },

    computed: {
        ...mapGetters(["arxmlFilesCount","allArxmlFiles"])
    },

    methods: {
        ...mapActions(["addArxmlFile","removeArxmlFile"]),
        onUpload : function () {
            let arxml = this.$refs.file.files[0];
            this.$refs.file.value = ""

            if (arxml.name.endsWith('.arxml')) { 
                let reader = new FileReader();
                reader.onload = (e) => {
                    const parserOptions = {
                        attributeNamePrefix: "@_",
                        ignoreAttributes: false,
                        ignoreNameSpace: false,
                        parseNodeValue: false,
                        parseAttributeValue: false
                    };
                    let streamJSON = {
                        "AUTOSAR": {
                            "AR-PACKAGES": {
                                "AR-PACKAGE": []
                            }
                        }
                    };
                    let arpackageJSON = parser.parse(e.target.result, parserOptions);
                    streamJSON['AUTOSAR']['AR-PACKAGES']['AR-PACKAGE'].push(arpackageJSON['AUTOSAR']['AR-PACKAGES']['AR-PACKAGE']);
                    let tempData = { 'asd':arxml.type,'filename': arxml.name, 'data': streamJSON };
                    this.addArxmlFile({type:"select",data:tempData})
                    this.$vToastify.success("File Imported Successfully");
                }
                reader.readAsText(arxml)
            } else {
                this.$vToastify.error("Invalid File Format");
            }
        },
        clickUpload : function () {
            this.$refs.file.click()
        }
    }
}
</script>

<style>
.file-viewer {
    height: 100%;
    overflow-y: auto;
    overflow-x: auto;
    border: 1px dotted;
    margin: 0 10px;
}

#file-container {
    height: 100%;
    overflow-y: auto;
    overflow-x: auto;
    border:1px dotted;
    margin:0 10px;
}

.file-name {
    background: bisque;
    font-weight: bold;
    padding:5px;
}

.icon{
    height: 20px;
    width: 20px;
    cursor: pointer;
    margin-left:15px;
}

.file-title{
    display: flex;
    padding-top:5px;
    width:100%;
    align-items: center;
}

.btn-container{
    width:100%;
    display: flex;
    justify-content: center;
    position: fixed;
    /* or absolute */
    top: 45%;
}

.btn-upload{
    text-align: center;
    font-size: 22px;
    background: #0000FF;
    font-weight: bold;
    color:white;
    padding: 10px 20px;
    border-radius: 10px;
    cursor: pointer;
    border:none;
}

.btn-upload:hover{
    background: #0606aa;
}
</style>