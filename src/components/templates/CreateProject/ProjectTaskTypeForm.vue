<!-- =========================================================================================
    Created By : Dipsha Kalariya
    Commnet : This component is used to display project task type detail for blank project form as step-4 in create project module.
========================================================================================== -->
<template>
<div class="statusHeader statusHeader_one">
    <div class="bg-light-gray"  :class="{'border-radius-5-px': clientWidth > 767 , 'border-radius-8-px': clientWidth <= 767 } ">
        <h3 v-if="fromWhich == ''" class="heading_text mt-0" 
        :class="{'border-radius-5-px  task-heading-desktop': clientWidth > 767 , 'border-radius-8-px task-heading-mobile': clientWidth <= 767}"
        >Add the type of tasks you need</h3>
        <h3 v-else class="heading_text mt-0" 
        :class="{'border-radius-5-px  task-heading-desktop': clientWidth > 767 , 'border-radius-8-px task-heading-mobile': clientWidth <= 767}"
        >What task type do you want?</h3>
    </div>
    <div class="taskStatusSection style-scroll">
        <div class="statusTaskWrapper d-flex justify-content-between">
            <div class="taskStatusLeft" id="createprojecttasktypetemplate_driver">
                <div class="d-flex justify-content-between w-90">
                    <label class="templetes mb-6px" :class="{'template-label-desktop': clientWidth > 767 , 'template-label-mobile': clientWidth <= 767}">Templates ({{taskTypeTemplates.length}})</label>
                    <img class="cursor-pointer" src="@/assets/images/svg/pluss.svg" id="createprojecttasktype_driver" @click="activeTemplate()"/>
                </div>
                <ul class="templated_name_ul position-re">
                    <li v-for="(tempVal,index) in taskTypeTemplates" v-bind:key="index" class="cursor-pointer" :class="[{'temp_save_value':tempVal.isShowSave}]">
                        <span v-if="!tempVal.isEditable" :class="[{'temp_save_dot':tempVal.isShowSave, 'templated-name-desktop': clientWidth > 767, 'templated-name-mobile': clientWidth <= 767}]" :style="`${theModel.taskTypeField.value._id === tempVal._id ? 'color: #3845B3 !important; font-weight: 500' : ''}`" :title="tempVal.TemplateName"  @click="setTemplateData(tempVal)" class="templated_name text-ellipsis text-capitalize" > {{tempVal.TemplateName}} </span>
                            <input type="text" class="statusInputText form-control edit-input statuseditInput" :maxlength="50" v-if="tempVal.isEditable" v-model.trim="taskTypeName" @keypress.enter="editTaskTypeTemplate(tempVal,index)" @input="errTempMsg=''"/>
                            <span class="position-ab"  v-if="tempInd === index" :style="[{paddingTop : clientWidth > 767 ? '8px' : '1px', right : clientWidth > 767 ? '20px' : '20px'}]">
                                <img :src="saveIcon" class="cursor-pointer" v-if="tempVal.isEditable" @click="editTaskTypeTemplate(tempVal,index)">
                                <img :src="deletered" class="cursor-pointer ml-10px" v-if="tempVal.isEditable" @click="tempVal.isEditable = false,errTempMsg=''">
                            </span>
                        <span class="task-leftside" v-if="!tempVal.isEditable && tempVal.isShowSave !== true && tempVal.TemplateName !== 'Custom'">
                            <img :src="templateEditIcon" alt="editicon" class="taskleftEditIcon" @click="taskTypeName = tempVal.TemplateName,tempVal.isEditable=true,addTaskType=false,isTemplate=false,errTempMsg = '',openEditTemplate(index)"/>
                            <img v-if="!tempVal.default" :src="templateDeleteIcon" alt="deleteicon" class="taskleftdeleteIcon" @click="tempInd = '',isDeleteTemp = true,deleteTemplateObj = tempVal"/>
                        </span>
                        <button type="button" class="save_template" v-if="tempVal.isShowSave" @click="saveTaskTypeTemplateData()">Save Template</button>
                    </li>
                </ul>
                <ConfirmationSidebar
                    v-model="isDeleteTemp"
                    :acceptButtonClass="`btn-danger`"
                    acceptButton="Delete"
                    title="Delete Template"
                    message="Are you sure you want to delete the template?"
                    :isShowInput="false"
                    @confirm="handleConfirm"
                >
                    <template #body>
                        <div></div>
                    </template>
                </ConfirmationSidebar>
                <button class="add_template" type="button" @click="activeTemplate()">+ New Template</button>
                <div class="d-flex position-re">
                    <input v-if="isTemplate" placeholder="Enter Template" class="add_new_temp form-control" :maxlength="50"  type="text" @keypress.enter.prevent="addNewTaskTypeTemplate()" v-model.trim="templateName" @input="removeValidation()"/>
                    <span class="position-ab edit-rightinput save__closeimg-wrapper">
                        <img :src="saveIcon" class="cursor-pointer"  v-if="isTemplate" @click="addNewTaskTypeTemplate(), templateName = ''">
                        <img :src="deletered" class="cursor-pointer ml-10px" v-if="isTemplate" @click="isTemplate = false, templateName = '',errTempMsg= ''">
                    </span>
                </div>
                <div class="err_temp_status">
                    <div class="red font-size-11">{{theModel.taskTypeField.error}}</div>
                    <span v-if="errTempMsg" class="err_temp red font-size-12">{{errTempMsg}}</span>
                </div>
            </div>
            <div class="taskStatusRight taskyou_need_right" id="createprojecttasktypetemplatestatus_driver">
                <label :class="{'taskstatustitle-desktop': clientWidth > 767 , 'taskstatustitle-mobile': clientWidth <= 767}" >Task Type</label>
                <DragDropField v-if="theModel.taskTypeField.value && Object.keys(theModel.taskTypeField.value).length > 0" :group="{ name: 'task_type_group' }" :isDeletable="true" :isChangeColor="false" :modelValue="theModel.taskTypeField.value.taskTypes"  @enter:updateFieldValue="addedTaskType" @click:updateFieldValue="addedTaskType" @input:deleteFieldValue="manageDeleteData" @resetTaskTypeErr="taskTypeError=''" @renameUpdate="(val) => {renameUpdate(val)}" :addTaskType="addTaskType" @disbaleButton="(val)=>{$emit('disableNext',val)}" :isTemplate="isTemplate" :useDataArray="useTaskTypeArr" @update:modelValue="manageSelectedOption" :from="'task_type'"/>
                <div class="addStatusBtn searchValue mb-0">
                    <!-- <input type="file" style="display: none;" ref="task_type_image" accept="image/*" @change="checkFile"> -->

                    <button class="cursor-pointer btn btn-primary" type="button" v-if="!addTaskType" @click="taskTypeName = '',isTaskSidebarOpen = true,isTemplate = false,$emit('openTaskTYpe',true),taskTypeTemplates.map((x)=>{return x.isEditable = false})" id="createprojecttasktypenew_driver">+ Add Task Type</button>
                    <div class="d-flex align-items-center justify-content-between" v-else>
                        <button class="cursor-pointer upload-image-btn up__btn btn-primary" type="button">
                            <img v-if="addNewtaskImage" :src="addNewtaskImage" class="projecttasktypeform__image__after"/>
                            <img v-else src="@/assets/images/svg/upload.svg" class="projecttasktypeform__image__before" alt="upload">
                        </button>
                        <input placeholder="Enter Task Type" class="addStatusInput form-control add__task-type" v-model.trim="taskTypeName" @keypress.enter.prevent="addTaskTypeStatus('addType')" id="searchValueOutside" type="text" @input="resetTaskTypeData()">
                        <img class="greenCheck cursor-pointer green__check" src="@/assets/images/svg/greencheck2.svg" @click="addTaskTypeStatus('addType')" alt="save">
                        <img class="crossCheck cursor-pointer cross__check" src="@/assets/images/svg/deletered.svg" alt="cancel" @click="clearTaskType(),addNewtaskImage=''">
                    </div>
                </div>
                <div class="red pt-5px" >
                    <span v-if="taskTypeError" class="font-size-12 red">{{taskTypeError}}</span>
                </div>
            </div>
        </div>
    </div>
    <TaskStatusSidebar v-if="isTaskSidebarOpen" :isTaskSidebarOpen="isTaskSidebarOpen" @closesidebar="isTaskSidebarOpen = false" title="List of Task Type" :options="statusOPtion" @selected="updateTaskStatus" @removed="removeTaskStatus" :isAddStatus="true" :type="'task_type'" :useDataArray="useTaskTypeArr"/>
</div>
</template>
<script setup>
import { useStore } from "vuex";
import { ref, onMounted, watch, inject } from 'vue';
import DragDropField from '@/components/atom/DragDropField/DragDropField.vue';
const {getters, commit} = useStore();
import { dbCollections } from '@/utils/FirebaseCollections';
import {useToast} from 'vue-toast-notification';
import ConfirmationSidebar from "@/components/molecules/ConfirmationSidebar/ConfirmationSidebar.vue";
import TaskStatusSidebar from '@/components/molecules/TaskStatusSidebar/TaskStatusSidebar.vue';
import { mongodbCrudOperations } from "@/utils/MongoQueries/crudOperations/crudOperations";
import { BSON } from "realm-web";

    const templateEditIcon = require('@/assets/images/svg/edit_icon.svg');
    const templateDeleteIcon = require('@/assets/images/svg/closeLeftHover.svg');
    const saveIcon = require("@/assets/images/svg/right_tick_green.svg");
    const deletered = require("@/assets/images/svg/deletered.svg");
    // const companyId = inject("$companyId");
    const taskTypeTemplates = ref([]);  
    const clientWidth = inject("$clientWidth");
    const $toast = useToast();
    const props = defineProps({
        modelValue: {
            type: Object,
            default: () => ({}),
        },
        projectData: {
            type: Object,
            default: () => ({})
        },
        from: {
            type: String,
            default: () => (''),
        }
    });
    const emit = defineEmits([
        'update:modelValue','disableNext','openTaskTYpe','updateModel','renameTaskTypeSetting','setTemplateDataTaskType','saveTemplate','spinnerOn'
    ]);
    const isDeleteTemp = ref(false);
    const deleteTemplateObj = ref({});
    const theModel = ref(props.modelValue);
    const fromWhich = ref(props.from)
    const useTaskTypeArr = ref([]);
    const newTaskTypeData = ref([]);
    const isTaskSidebarOpen = ref(false);
    const statusOPtion = ref([]);
    const isDelete = ref(false);
    const hanldeProjectTaktypeTour = inject("hanldeProjectTaktypeTour");
    onMounted(() => {
        taskTypeTemplates.value = JSON.parse(JSON.stringify(getters['settings/taskType']));
        emit('update:modelValue', theModel.value);
        if(taskTypeTemplates.value.length > 0){
            if(fromWhich.value === 'setting'){
                let index = taskTypeTemplates.value.findIndex((x) => {
                    return x._id === props.projectData.TaskTypeTemplateId;
                })
                if(index !== -1){
                    theModel.value.taskTypeField.value = Object.keys(theModel.value.taskTypeField.value).length ? theModel.value.taskTypeField.value : taskTypeTemplates.value[index]    
                }else{
                    const customObj = {
                        TemplateName : 'Custom',
                        taskTypes : props.projectData.taskTypeCounts
                    }
                    taskTypeTemplates.value = [customObj, ...taskTypeTemplates.value];
                    theModel.value.taskTypeField.value = Object.keys(theModel.value.taskTypeField.value).length ? theModel.value.taskTypeField.value : customObj;
                }
            }else{
                theModel.value.taskTypeField.value = Object.keys(theModel.value.taskTypeField.value).length ? theModel.value.taskTypeField.value : taskTypeTemplates.value[0];
                let find = taskTypeTemplates.value.find((x) => x._id === theModel.value.taskTypeField.value._id);
                if(find === undefined){
                    taskTypeTemplates.value.push(theModel.value.taskTypeField.value);
                }
            }
            statusOPtion.value = theModel.value.taskTypeField.value.taskTypes;
        }
        if(Object.keys(props.projectData).length > 0) {
            props.projectData.taskTypeCounts.forEach((x) => {
                const query = {
                    type: "findOne",
                    collection: dbCollections.TASKS,
                    data: [
                        {
                            ProjectID: BSON.ObjectId(props.projectData._id),
                            TaskTypeKey: x.key 
                        }
                    ]
                }
                mongodbCrudOperations(query).then((result) =>{
                    if(result){
                        useTaskTypeArr.value.push(result);
                    }
                })
            })
    
        }
        if(hanldeProjectTaktypeTour && hanldeProjectTaktypeTour.value !== null) {
            hanldeProjectTaktypeTour.value();
        }
    })

    watch(() => getters['settings/taskType'], (val) => {
        taskTypeTemplates.value = JSON.parse(JSON.stringify(val));
        if(taskTypeTemplates.value.length){
            if(fromWhich.value === 'setting'){
                let index = taskTypeTemplates.value.findIndex((x) => {
                    return x._id === props.projectData.TaskTypeTemplateId;
                })
                if(index !== -1){
                    theModel.value.taskTypeField.value = Object.keys(theModel.value.taskTypeField.value).length ? theModel.value.taskTypeField.value : taskTypeTemplates.value[index]    
                }else{
                    const customObj = {
                        TemplateName : 'Custom',
                        taskTypes : props.projectData.taskTypeCounts
                    }
                    taskTypeTemplates.value = [customObj, ...taskTypeTemplates.value];
                    theModel.value.taskTypeField.value = Object.keys(theModel.value.taskTypeField.value).length ? theModel.value.taskTypeField.value : customObj;
                }
            }else{
                theModel.value.taskTypeField.value = Object.keys(theModel.value.taskTypeField.value).length ? theModel.value.taskTypeField.value : taskTypeTemplates.value[0];
            }
            statusOPtion.value = theModel.value.taskTypeField.value.taskTypes;
        }
    })
    watch(()=> props.modelValue ,(val)=>{
        theModel.value = val;
    })
    const isTemplate = ref(false);
    const templateName = ref('');
    const addTaskType = ref(false);
    const taskTypeName = ref("");
    const taskTypeError = ref("");
    const addNewtaskImage = ref("");
    const tempInd = ref(null)
    function activeTemplate(){
        isTemplate.value = true;
        addTaskType.value = false;
        taskTypeTemplates.value.map((x)=>{return x.isEditable = false});
    }
    function manageSelectedOption(e){
        theModel.value.taskTypeField.value.taskTypes = e;
        let indexKey = taskTypeTemplates.value.findIndex((x)=>{
            return x._id == theModel.value.taskTypeField.value._id
        });
        if(indexKey !== -1 && theModel.value.taskTypeField.value.TemplateName !== 'Custom'){
            taskTypeTemplates.value[indexKey].isShowSave = true;
        }
    }
    function addedTaskType(item){
        addTaskTypeStatus('editType',item);
    }
    function manageDeleteData(item){
        addTaskTypeStatus('deleteType',item);
    }
    function setTemplateData(itemData) {
        theModel.value.taskTypeField = {};
        theModel.value.taskTypeField.value = itemData;
        statusOPtion.value = theModel.value.taskTypeField.value.taskTypes;
        if(fromWhich.value === 'setting'){
            emit('spinnerOn')
            newTaskTypeData.value = theModel.value.taskTypeField.value.taskTypes;
            const notMatchedProjects = props.projectData.taskTypeCounts.filter((x) => {
                return !newTaskTypeData.value.some((y) => y.key === x.key);
            });
            if(notMatchedProjects.length > 0){
                notMatchedProjects.forEach(async(x) => {
                    const query = {
                        type: "find",
                        collection: dbCollections.TASKS,
                        data: [
                            {
                                ProjectID: BSON.ObjectId(props.projectData._id),
                                TaskTypeKey: x.key
                            }
                        ]
                    }
                    await mongodbCrudOperations(query).then((result) =>{
                        if(result && result.length){
                            useTaskTypeArr.value.push(result[0]);
                        }
                    })
    
                    emit('setTemplateDataTaskType',useTaskTypeArr.value,notMatchedProjects)
                })
            }else{
                emit('setTemplateDataTaskType',useTaskTypeArr.value,notMatchedProjects)
            }
        }
        emit('update:modelValue', theModel.value);
    }
    const errTempMsg = ref("");
    function addNewTaskTypeTemplate(){
        if(templateName.value === "" || templateName.value === null){
            errTempMsg.value = "Template name is required";
            return;
        }
        if(templateName.value.toLowerCase() === 'custom'){
            $toast.error("Can not create template name Custom",{position: 'top-right'});
            return;
        }
        let mainId = taskTypeTemplates.value.findIndex(item=>{
            return item.TemplateName.replaceAll(" ", "_").toLowerCase() === templateName.value.replaceAll(" ", "_").toLowerCase();
        })
        const insertObj = {
            TemplateName : templateName.value,
            taskTypes : [
                {
                    'default': true,
                    'name': 'Task',
                    'taskCount': 0,
                    'value': "task",
                    'taskImage': addNewtaskImage.value !== "" ? addNewtaskImage.value : 'setting/task_type/task.png',
                    'isAddNewStatus': false,
                    'key': 1,
                    'isEditable': false,
                    'isDeleted': false,
                    'assignAsSubtask': false,
                    'assignAsTask': false,
                }
            ]
        }
        if(mainId === -1){
            const getQuery = {
                type: "insertOne",
                collection: dbCollections.TASK_TYPE_TEMPLATES,
                data: [insertObj]
            }
            mongodbCrudOperations(getQuery).then((response)=>{
                commit("settings/mutateTaskType", {data: {...insertObj, _id: response.insertedId}, op: "added"});
                theModel.value.taskTypeField.value = {...insertObj, _id: response.insertedId};
                templateName.value = "";
                $toast.success("Template has been created Successfully.",{position: 'top-right'});
            })
        }
        if(mainId !== -1){
            errTempMsg.value = "This template name is already exists.";
        }
        emit('update:modelValue', theModel.value);
    }
    function addTaskTypeStatus(type,rowData){
        if(type === "deleteType"){
            isDelete.value = true;
            let temp = theModel.value.taskTypeField.value.taskTypes;
            let mainKey = temp.findIndex(item=>{
                return item.key === rowData.key;
            })
            if(mainKey !== -1){
                theModel.value.taskTypeField.value.taskTypes.splice(mainKey, 1);
            }
            let indexKey = taskTypeTemplates.value.findIndex((x)=>{
                return x._id == theModel.value.taskTypeField.value._id
            });
            if(indexKey !== -1 && theModel.value.taskTypeField.value.TemplateName !== 'Custom'){
                taskTypeTemplates.value[indexKey].isShowSave = true;
            }
        }
        emit('update:modelValue', theModel.value);
    }
    function clearTaskType(){
        taskTypeName.value = "";
        addTaskType.value = false;
        taskTypeError.value = "";
    }
    function saveTaskTypeTemplateData(){
        let indexKey = taskTypeTemplates.value.findIndex((x)=>{
            return x._id == theModel.value.taskTypeField.value._id
        });
        if(indexKey !== -1){
            delete taskTypeTemplates.value[indexKey].isShowSave;
        }
        const oldId = theModel.value.taskTypeField.value._id
        const obj = {
            'TemplateName':theModel.value.taskTypeField.value.TemplateName,
            'taskTypes': theModel.value.taskTypeField.value.taskTypes
        }
        if(theModel.value.taskTypeField.value.default !== undefined){
            obj.default = theModel.value.taskTypeField.value.default
        }
        const query = {
            type : 'deleteOne',
            data : [{
                _id : BSON.ObjectId(theModel.value.taskTypeField.value._id)
            }],
            collection : dbCollections.TASK_TYPE_TEMPLATES
        }
        mongodbCrudOperations(query).then(async()=>{
            commit("settings/mutateTaskType", {data: {_id: oldId}, op: "removed"});
            const getQuery = {
                type: "insertOne",
                collection: dbCollections.TASK_TYPE_TEMPLATES,
                data: [obj]
            }
            await mongodbCrudOperations(getQuery).then((response)=>{
                theModel.value.taskTypeField.value = {...obj , _id : response.insertedId};
                let index = taskTypeTemplates.value.findIndex((x) => x._id === response.insertedId);
                if(index === -1){
                    taskTypeTemplates.value.push({...obj , _id : response.insertedId});
                }
                const index1 = taskTypeTemplates.value.findIndex((type) => type._id === oldId);
                if(index1 !== -1) {
                    taskTypeTemplates.value.splice(index1, 1);
                }
                emit('saveTemplate',response.insertedId,oldId,'tasktype');
            }).catch((err) => {
                console.error(err)
            })
        })
    }
    function removeValidation () {
        errTempMsg.value = '';
    }
    function resetTaskTypeData () {
        taskTypeError.value = "";
    }
    function editTaskTypeTemplate (temp,ind) {
        if(taskTypeName.value !== ''){
            if(taskTypeName.value.toLowerCase() === 'custom'){
                $toast.error("Can not create template name Custom",{position: 'top-right'});
                return;
            }
            const duplicateNameIndex = taskTypeTemplates.value.findIndex(
                (object, i) => object.TemplateName === taskTypeName.value && i !== ind
            );
            let mainId = taskTypeTemplates.value.findIndex(item=>{
                return item.TemplateName=== taskTypeName.value;
            })
            let obj = {
                TemplateName : taskTypeName.value
            }
            if(mainId === -1 || duplicateNameIndex === -1){
                const query = {
                    collection: dbCollections.TASK_TYPE_TEMPLATES,
                    type: "updateOne",
                    data: [
                        {
                            _id: BSON.ObjectId(temp._id)
                        },
                        {
                            $set: {...obj}
                        }
                    ]
                }
                mongodbCrudOperations(query).then(()=>{
                    let index = taskTypeTemplates.value.findIndex((x) => x._id === temp._id);
                    if(index !== -1) {
                        let modifiedObj = {...taskTypeTemplates.value[index],TemplateName: taskTypeName.value,isEditable:false};
                        commit("settings/mutateTaskType", {data: {...modifiedObj, _id: temp._id}, op: "modified"});
                    }
                    $toast.success("Template name updated successfully.",{position: 'top-right'});
                })
            }
            if(mainId !== -1 && duplicateNameIndex !== -1){
                errTempMsg.value = "This template name is already exists.";
            }
        }else{
            errTempMsg.value = "This template name is required.";
        }
    }
    function handleConfirm(){
        const query = {
            type : 'deleteOne',
            data : [{
                _id : BSON.ObjectId(deleteTemplateObj.value._id)
            }],
            collection : dbCollections.TASK_TYPE_TEMPLATES
        }
        mongodbCrudOperations(query).then(()=>{
            isDeleteTemp.value = false;
            theModel.value.taskTypeField.value = taskTypeTemplates.value[0] || {};
            commit("settings/mutateTaskType", {data: {_id: deleteTemplateObj.value._id}, op: "removed"});
            $toast.success("Template deleted successfully.",{position: 'top-right'});
        }).catch((err) =>{
            console.error(err,"Error in Delete Template");
        })
    }
    function renameUpdate(val) {
        addTaskType.value = val;
        isTemplate.value = val;
        taskTypeTemplates.value.map((x)=>{return x.isEditable = false});
    }
    function openEditTemplate(index){
        taskTypeTemplates.value.forEach((x,ind) => {
            if(ind === index){
                x.isEditable = true;
            }else{
                x.isEditable = false;
            }
        })
        tempInd.value = index;
    }
    function updateTaskStatus (event) {
        let index = theModel.value.taskTypeField.value.taskTypes.findIndex((typ) => {
            return typ.key === event.key;
        })
        if(index === -1) {
            theModel.value.taskTypeField.value.taskTypes.push(event);
        }
        let indexKey = taskTypeTemplates.value.findIndex((x)=>{
            return x._id == theModel.value.taskTypeField.value._id
        });
        if(indexKey !== -1 && theModel.value.taskTypeField.value.TemplateName !== 'Custom'){
            taskTypeTemplates.value[indexKey].isShowSave = true;
        }
    }
    function removeTaskStatus (event) {
        let activeIndex = theModel.value.taskTypeField.value.taskTypes.findIndex((x) => {
            return x.key === event.key
        })

        if(activeIndex !== -1) {
            theModel.value.taskTypeField.value.taskTypes.splice(activeIndex,1);
        }
        let indexKey = taskTypeTemplates.value.findIndex((x)=>{
            return x._id == theModel.value.taskTypeField.value._id;
        });
        if(indexKey !== -1 && theModel.value.taskTypeField.value.TemplateName !== 'Custom'){
            taskTypeTemplates.value[indexKey].isShowSave = true;
        }
    }
</script>
<style scoped>
@import './style.css';
</style>
