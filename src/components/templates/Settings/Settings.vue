<template>
    <div class="d-flex flex-column h-100" v-if="loading">
        <div class="blue font-weight-bold d-flex align-items-center justify-content-between top_section" id="top_section">
            <div class="d-flex align-items-center">
                <img :src="sidebarArrowIcon" alt="sidebarArrowIcon" class="cursor-pointer mr-10px" @click="visible = !visible" v-if="clientWidth <= responseWidth">
                <span class="mr-10px">
                    {{$route.meta.title}}
                </span>
            </div>
            <button @click="openTeamSidebar = true" class="white border-0 cursor-pointer blue_btn align-items-center d-flex mr-0" v-if="$route.meta.title === 'Teams' && checkPermission('settings.settings_create_team') === true"><img :src=" addnewteam" alt="AddNewTeam" class="mr-5px"> Add New Team</button>
            <button @click="toggleCreateProjectSB()" class="white border-0 cursor-pointer blue_btn align-items-center d-flex align-items-center justify-content-center add__new-project" v-if="$route.meta.title === 'Projects' && checkPermission('project.project_list') === true && checkPermission('project.project_create') === true" >+ Add New Project</button>
        </div>
        <div class="d-flex flex-row overflow-hidden setting__leftright-wrapper">
            <div class="setting-section-left" v-if="clientWidth && clientWidth > responseWidth">
                <div :class="selectedCompany?.Cst_profileImage == undefined || selectedCompany?.Cst_profileImage =='' ? 'd-flex align-items-center p-1':'d-flex align-items-center p-1'" :style="selectedCompany?.Cst_profileImage == undefined || selectedCompany?.Cst_profileImage =='' ? 'padding-left: 20px' : ''">
                    <span class="no-img" v-if="selectedCompany?.Cst_profileImage == undefined || selectedCompany?.Cst_profileImage ==''">
                        {{selectedCompany?.Cst_CompanyName.charAt(0).toUpperCase()}}
                    </span>
                    <template v-else> 
                        <img v-if="selectedCompany?.Cst_profileImage?.includes('firebasestorage')"  :src="selectedCompany?.Cst_profileImage" alt="CompanyProfile" class="company_logo" >    
                        <WasabiIamgeCompp v-else :companyId="selectedCompany?.id" :data="{url:selectedCompany?.Cst_profileImage}" thumbnail="26x26" class="company_logo"/>
                    </template>
                    <span class='blue companyname ml-10px' :title="selectedCompany?.Cst_CompanyName">
                        {{selectedCompany?.Cst_CompanyName}}
                    </span>
                </div>
                <div class="tab__item-wrapper style-scroll">
                    <div v-for="(tab, index) in tabs" :key="index">
                        <router-link  v-if="tab?.permissions ? checkAllPermissions(tab?.permissions,tab.label) : tab?.isVisible " :to="!tab.section ? {...tab.to} : {}" @click="$route.name = tab.to.name"  class="p-1 d-flex align-items-center" :class="{'active-tab': ($route.name === tab.to.name), 'border-top': tab.section ,'side_tab_border':!($route.name === tab.to.name),'cursor-pointer' : !tab.section,'hover-bg-light-gray': !tab.section}">
                            <WasabiIamgeCompp v-if="tab.label === UserName" :userImage="true" :thumbnail="'26x26'" :data="{url: UserProfile }" class="company_logo"/>
                            <img v-else :src="$route.name === tab.to.name ? tab.activeIcon : tab.icon" :alt="tab.label"  class="ml-18px vertical-middle"  :class="{'company_logo': tab.section}" :style="!tab.section ?'width: 13px; height: 14px;' : ' '">
                            <span :class="{'blue': $route.name === tab.to.name,'blue companyname text-ellipsis text-nowrap':tab.section}" class="ml-13px gray4b" :title="tab.label">
                                {{tab.label}} 
                            </span>
                        </router-link>
                    </div>
                 </div>
            </div>
            <Sidebar v-else v-model:visible="visible" className="z-index-6" :left="true" width="400px" :unMount="false" :title="$route.meta.title">
                <template #body>
                    <div :class="selectedCompany?.Cst_profileImage == undefined || selectedCompany?.Cst_profileImage =='' ? 'd-flex align-items-center p-1':' d-flex align-items-center p-1'">
                        <span class="no-img" v-if="selectedCompany?.Cst_profileImage == undefined || selectedCompany?.Cst_profileImage =='' ">
                            {{selectedCompany?.Cst_CompanyName.charAt(0)}}
                        </span>
                        <template v-else>
                            <img  v-if="selectedCompany?.Cst_profileImage?.includes('firebasestorage')" :src="selectedCompany?.Cst_profileImage" alt="CompanyProfile" class="company_logo" >
                            <WasabiIamgeCompp :companyId="selectedCompany?.id" :data="{url:selectedCompany?.Cst_profileImage}" thumbnail="26x26" class="company_logo"/>
                        </template>
                        <span class='blue companyname ml-10px' :title="selectedCompany?.Cst_CompanyName">
                            {{selectedCompany?.Cst_CompanyName}}
                        </span>

                    </div>
                    <div class="tab__item-wrapper style-scroll">
                        <router-link v-for="(tab, index) in tabs" :key="index" :to="!tab.section ? {...tab.to} : {}" @click="$route.name = tab.to.name" class="d-flex align-items-center p-1" :class="{'active-tab': ($route.name === tab.to.name), 'border-top': tab.section,'cursor-pointer' : !tab.section,'hover-bg-light-gray': !tab.section}">
                            <WasabiIamgeCompp v-if="tab.label === UserName" :userImage="true" :thumbnail="'26x26'"  :data="{url: UserProfile }" class="company_logo"/>
                            <img v-else :src="$route.name === tab.to.name ? tab.activeIcon : tab.icon" :alt="tab.label" class="ml-18px vertical-middle"  :class="{'company_logo': tab.section}" :style="!tab.section ?'width: 13px; height: 14px;' : ' '">
                            <span :class="{'blue': $route.name === tab.to.name}" class="ml-13px gray4b" :title="tab.label">
                                {{tab.label}}
                            </span>
                        </router-link>
                    </div>
                </template>
            </Sidebar>
            <div class="setting-section-right bg-light-gray position-re overflow-auto style-scroll">
                <router-view/>
            </div>
        </div>
        <AddTeamSidebar v-if="openTeamSidebar === true" :openTeamSidebar="openTeamSidebar" @closeTeamSidebar="(val) => {openTeamSidebar = val}"  />
        <CreateProjectSidebar v-if="isActiveCreateSidebar" :isActiveCreateSidebar="isActiveCreateSidebar" @click:closeSidebar="toggleCreateProjectSB" @closeSidebar="toggleCreateProjectSB"/>
    </div>
</template>

<script setup>
    // IMPORT
    import { useStore } from "vuex";
    import { useGetterFunctions } from "@/composable";
    import { useCustomComposable } from '@/composable';
    import Sidebar from "@/components/molecules/Sidebar/Sidebar.vue";
    import { defineComponent, inject, ref, computed, watch, onMounted } from "vue";
    import AddTeamSidebar from "@/components/molecules/AddTeamSidebar/AddTeamSidebar.vue";
    import WasabiIamgeCompp from "@/components/atom/WasabiIamgeCompp/WasabiIamgeCompp.vue";
    import CreateProjectSidebar from '@/components/organisms/CreateProject/CreateProjectSidebar.vue';
    import { useRouter,useRoute } from 'vue-router';

    // IMAGES
    const sidebarArrowIcon = require("@/assets/images/svg/sidebarclose_arrow.svg");

    // UTILS
    const route = useRoute();
    const responseWidth = 1300;
    const router = useRouter();
    const userId = inject("$userId");
    const companyId = inject("$companyId");
    const clientWidth = inject("$clientWidth");
    const { checkPermission } = useCustomComposable();

    defineComponent({
        name: "Settings-Component",
        components: {
            Sidebar
        }
    });

    //getter
    const { getters } = useStore();
    const { getUser } = useGetterFunctions();
    // computed
    const companies = computed(() => {
        return getters["settings/companies"];
    });
    // variable
    const visible = ref(false);
    const loading = ref(false);
    const selectedCompany = ref("");
    const openTeamSidebar = ref(false);
    const isActiveCreateSidebar = ref(false);
    const user = ref(getUser(userId.value, 1));
    const UserName = ref(user.value.Employee_Name);
    const UserProfile = ref(user.value.Employee_profileImage);
    const addnewteam= require("@/assets/images/AddNewTeam.png");
    // 
    const tabs = ref([
        {
            label: "Settings",
            to: {name: "Setting"},
            icon: require("@/assets/images/svg/WorkspaceSettingsInactive.svg"),
            permissions:['settings.settings_edit_company','settings.settings_task_priority','settings.settings_file_extensions','settings.settings_project_milestone_status'],
            activeIcon: require("@/assets/images/svg/WorkspaceSettings.svg"),
        }, {
            label: "Members",
            to: {name: "Members"},
            icon: require("@/assets/images/svg/workspacePeoples.svg"),
            permissions:['settings.settings_role_management' , 'settings.settings_designation', 'settings.settings_member_list'],
            activeIcon: require("@/assets/images/svg/workspacePeoplesInactive.svg"),
        }, {
            label: "Teams",
            to: {name: "Teams"},
            icon: require("@/assets/images/svg/workspaceTeams.svg"),
            permissions:['settings.settings_team_list'],
            activeIcon: require("@/assets/images/svg/workspaceTeamsActive.svg")
        }, {
            label: "Projects",
            to: {name: "Settings-Projects"},
            icon: require("@/assets/images/svg/workspaceProject.svg"),
            permissions:['settings.settings_project_list'],
            activeIcon: require("@/assets/images/svg/workspaceProjectActive.svg")
        }, {
            label: "Templates",
            to: {name: "Template"},
            icon: require("@/assets/images/svg/template_icon_gray.svg"),
            isVisible:true,
            activeIcon: require("@/assets/images/svg/template_icon_blue.svg")
        }, {
            label: "Custom Field Manager",
            to: {name: "Custom-Fields"},
            icon: require("@/assets/images/svg/WorkspaceSettingsInactive.svg"),
            isVisible:true,
            permissions:['settings.settings_custom_field'],
            activeIcon: require("@/assets/images/svg/WorkspaceSettings.svg"),
        },
        // 
        {
            label: "Security & Permissions",
            to: {name: "Security & Permissions"},
            icon: require("@/assets/images/svg/workspaceSecurity.svg"),
            permissions:['settings.settings_security_permissions'],
            activeIcon: require("@/assets/images/svg/workspaceSecurityActive.svg")
        },{
            label: UserName,
            to: {name: UserName},
            section: true,
            icon: UserProfile.value == undefined ? require("@/assets/images/default_user.png") : UserProfile ,
            isVisible:true,
            activeIcon:  UserProfile.value == undefined ? require("@/assets/images/default_user.png") : UserProfile
        }, {
            label: "My Settings",
            to: {name: "My Settings"},
            icon: require("@/assets/images/svg/WorkspaceSettingsInactive.svg"),
            isVisible:true,
            activeIcon: require("@/assets/images/svg/WorkspaceSettings.svg")
        }, {
            label: "Company",
            to: {name: "Company"},
            icon: require("@/assets/images/svg/Workspace.svg"),
            isVisible:true,
            activeIcon: require("@/assets/images/svg/company_active.svg")
        }, {
            label: "Notifications",
            to: {name: "Notifications"},
            icon: require("@/assets/images/svg/ProjectNotifications.svg"),
            isVisible:true,
            activeIcon: require("@/assets/images/svg/ProjectNotifications.svg")
        }, {
            label: "Time Tracking",
            to: {name: "Time Tracking"},
            icon: require("@/assets/images/timetracking.png"),
            isVisible:true,
            activeIcon: require("@/assets/images/timetracking.png")
        }
    ]);

    selectedCompany.value = companies.value.find((company) => company._id === companyId.value);

    watch(() => getUser(userId.value, 1),(newValue) => {
        UserName.value = newValue.Employee_Name;
        UserProfile.value = newValue.Employee_profileImage;
    });


    function toggleCreateProjectSB () {
        isActiveCreateSidebar.value = !isActiveCreateSidebar.value;
    }
    const checkAllPermissions = (permissions = [] , label) => {
        if(!permissions.length){ return false}
        let flag = false;

        if(label === "Members"){
            return (checkPermission(permissions[0]) !== null &&
            checkPermission(permissions[1]) !== null && checkPermission(permissions[2]) === true)
        }
        permissions.forEach((item) =>{
            if(checkPermission(item) !== null){
                flag = true
            }
        })
        return flag;
    };
    onMounted(()=>{
        for (let i = 0; i < tabs.value.length; i++) {
            const tab = tabs.value[i];
            if(tab.to.name === route.name){
                if ((tab?.permissions && checkAllPermissions(tab?.permissions, tab.label)) || (tab?.permissions === undefined)) {
                    router.push({ name: tab.to.name });
                    setTimeout(()=>{
                        loading.value = true;
                    },100);
                    break;
                }else if((tab?.permissions && checkAllPermissions(tab?.permissions, tab.label) === false && route.name === 'members') || tab?.permissions && (checkAllPermissions(tab?.permissions, tab.label) === false || checkAllPermissions(tab?.permissions, tab.label) === null)){
                    router.push({ name: 'My Settings' });
                    setTimeout(()=>{
                        loading.value = true;
                    },100);
                    break;
                }else{
                    router.push({ name: 'My Settings' });
                    setTimeout(()=>{
                        loading.value = true;
                    },100);
                    break;
                }
            }
        }
    });
</script>

<style scoped>
@import './style.css';
</style>