<!-- =========================================================================================
    Created By : Dipsha Kalariya
    Commnet : This component is used to display all the emplate & project details for save new project in create project module.
========================================================================================== -->
<template>
<!-- <img :src="back_arrow" class="templateDetailAllArrow" @click="emit('closeTemplateDetailAll')"> -->
<div class="afterClickCreateProjectstep usetemplate-wrapper" :class="{'useTemplate-mobiledevice': clientWidth <= 767 }">
    <div id="project-step-container" class="mobile-projectName-category-wrapper">
        <ProjectForm v-model="formData"/>
    </div>
    <div id="project-step-container" class="mobile-projectColorImage-wrapper">
        <ProjectProfileForm v-model="formData.projectProfileField" @update:image="(ele)=>{updateImageValue(ele)}" :name="formData.projectName"/>
    </div>
    <div id="project-step-container" class="ProjectShareGraphicModel">
        <ProjectWorkspace v-model="formData.workSpaceField" :name="formData.projectName" @disableNext="disableButton"/>
    </div>
    <button @click="submitData()" :class="[{'disableButton' : isSpinner || isDisable },]" class="submit-btn templateall__submit-btn cursor-pointer conditional-submit btn"  :disabled="isSpinner || isDisable">{{!isSpinner ? 'Create Project' : 'Loading...'}}</button>
</div>
</template>
<script setup>
import { useStore } from "vuex";
import ProjectForm from '@/components/templates/CreateProject/ProjectForm.vue';
import ProjectProfileForm from '@/components/templates/CreateProject/ProjectProfileForm.vue';
import ProjectWorkspace from '@/components/templates/CreateProject/ProjectWorkspace.vue';
import { ref, watch, inject, computed, nextTick } from "vue";
import * as helper from '@/components/templates/CreateProject/helper.js';
import * as env from '@/config/env';
import {useToast} from 'vue-toast-notification';
import { apiRequestWithoutCompnay } from '../../../services'
const { getUser } = useGetterFunctions();
import { useGetterFunctions } from "@/composable";
const userId = inject('$userId');
import { useValidation } from "@/composable/Validation";
import { dbCollections } from "@/utils/FirebaseCollections";
import { useRoute, useRouter } from "vue-router";
const  { checkAllFields } = useValidation();

    const { getters,commit } = useStore();
    const $toast = useToast();
    const companyUser = ref(getters['settings/companyUserDetail']);
    const CompanyDatabase = inject("$companyId");
    const userDataVal = getUserData();
    const emit = defineEmits(['update:modelValue','click:closeSubSidebar','update-processing']);
    const props = defineProps({
        modelValue : {
            type : Object,
            default : ()=>({})
        },
        templateView : {
            type : Object,
            default : ()=>({})
        }
    });
    const defaultCurrency = computed(() => getters['settings/allCurrencyArray']?.find((x) => x.code === "INR"))
    const formData = ref(props.modelValue);
    const templateViewObj = ref(props.templateView);
    const proIconData = ref({});
    const previewImage = ref(null);
    const clientWidth = inject("$clientWidth");
    const isSpinner = ref(false);
    const isDisable = ref(false)
    const route = useRoute();
    const router = useRouter();
    watch(()=>props.modelValue,()=>{
        formData.value = props.modelValue;
    })
        function getUserData() {
        const user = getUser(userId.value,true);
        const userData = {
            id: user.id,
            Employee_Name: user.Employee_Name,
        }
        return userData;
    }
    function submitData(){
        checkAllFields({projectName : formData.value.projectName,projectCategory: formData.value.projectCategory,projectCode:formData.value.projectCode}).then(async (valid)=>{
            if(valid){
                isSpinner.value = true;
                emit('update-processing', true);
                const obj = {
                    'AssigneeUserId': Array.from(new Set([companyUser.value.userId,...formData.value.leadUser.value.map((x)=>x.id), ...formData.value.workSpaceField.privateSpaceUsers.value.map((x) => x.id)])),
                    'ProjectName': formData.value.projectName.value,
                    'CompanyId': CompanyDatabase.value,
                    'ProjectCode': formData.value.projectCode.value,
                    'ProjectCategory': formData.value.projectCategory.value,
                    'ProjectType': "Fix",
                    'LeadUserId': formData.value.leadUser.value.map((x)=>x.id),
                    'markAsStar': false,
                    'sprintsObj': {},
                    'sprintsfolders': {},
                    'DueDate': formData.value.dueDate.value !== '' ? new Date(formData.value.dueDate.value) : "",
                    ...(formData.value.dueDate.value !== '' && { 'dueDateDeadLine': [{'date': new Date(formData.value.dueDate.value) }] }),
                    'projectIcon' : proIconData.value,
                    'TemplateName':  templateViewObj.value.TemplateName ? templateViewObj.value.TemplateName : '',
                    'TemplateId' : templateViewObj.value._id ? templateViewObj.value._id : '',
                    'isPrivateSpace': formData.value.workSpaceField.privateSpaceValue.value,
                    'TaskTypeTemplateId' : '',
                    'statusType': "active",
                    "lastTaskId": 1,
                    'ProjectRequiredDefaultComponent': templateViewObj.value.TemplateRequiredComponent.filter((x) => x.setAsDefault === true)[0].keyName,
                    'ProjectCurrency':defaultCurrency.value,
                    'useTemplateProj':templateViewObj.value.useTemplateProj,
                    'projectCreatedBy':userId.value,
                    'ProjectSource' : '',
                    'isGlobalPermission' : true,
                    'customFiedlsValue': templateViewObj.value?.customFiedlsValue || []
                }
                let path = `${CompanyDatabase.value}/${CompanyDatabase.value}/${dbCollections.PROJECTS}`;
                const { ObjectId } = require('bson');
                const docId = new ObjectId();
                if(formData.value.projectProfileField.previewImage.value !== "" && previewImage.value !== null){
                    const randomNumber = parseInt(Date.now() * Math.random());
                    const name = randomNumber + "_" + previewImage.value.name.replaceAll(" ", "_");
                    let filePath = `Project/${JSON.parse(JSON.stringify(docId))}/Settings/ProjectIcon/${name}`;
                    const apiFormData = new FormData();
                    apiFormData.append("file", previewImage.value);
                    apiFormData.append("companyId", CompanyDatabase.value);
                    apiFormData.append("path", filePath);
                    await apiRequestWithoutCompnay("post", env.WASABI_UPLOAD_FILE, apiFormData, "form").then((res)=>{
                        if(res.data.status){
                            proIconData.value = {type:"image", data: res.data.statusText}
                        }else{
                            proIconData.value = {type:"image", data: ''}
                        }
                    })
                }
                else{
                    proIconData.value = {type: "color", data : formData.value.projectProfileField.selectedColor.value };
                }
                let data = { ...obj,projectIcon : proIconData.value,id:docId };
                helper.HandleProject(path,data,userDataVal,CompanyDatabase.value,false).then((result)=>{
                    if(result.status === true){
                        $toast.success("Project data has been added successfully.",{position: 'top-right'});
                        isSpinner.value = false;
                        emit('update-processing', false);
                        emit('click:closeSubSidebar',false);
                        nextTick(() => {
                            router.replace({name: "Project", params: {cid: route.params?.cid, id: result.id}, query: {...route.query, tab : "ProjectListView"}})
                        })
                        var newObj = {snap: null, privateSnap: false, op: "added", data: {...data, id: result.id, isExpanded: false}};
                        commit("projectData/mutateProjects",newObj)
                        if(result?.customFieldValueArray) {
                            result.customFieldValueArray.forEach((customDataObj)=>{
                                commit("settings/mutateFinalCustomFields", {data: customDataObj || {},op: "added"});
                            })
                        }
                    }else{
                        $toast.error("Error in creating project",{position: 'top-right'});
                        isSpinner.value = false;
                        emit('update-processing', false);
                        emit('click:closeSidebar',false);
                    }
                })
                .catch((error) => {
                    isSpinner.value = false;
                    emit('update-processing', false);
                    console.error("ERROR in add teams: ", error);
                });
            }
        })
    }
    function updateImageValue(ele) {
        previewImage.value = ele[0]
    }
    function disableButton (event){
        isDisable.value = event;
    }
    </script>
<style>
.templateDetailAllArrow {
    position: absolute;
    top: 14px;
    left: 15px;
    cursor: pointer;
}
.templateall__submit-btn{
   background: #2F3990; border-radius: 4px; color: white; border: none; padding: 3px 14.1px;
}
.disableButton {
    background-color: #818181 !important;
}
</style>
