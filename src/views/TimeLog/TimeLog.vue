<template>
    <div class="timeLogWrapper" v-if="checkApps('TimeTracking')" :class="{ 'timelog_main': isShow === true}">
        <!-- <div class="cursor-pointer d-flex align-items-center back__Wrapper" v-if="isShow === true" @click="isShow = false">
            <img :src="backArrow">
            <h3 class="backClass black font-roboto-sans m-0">Back</h3>
        </div> -->
        <div class="user-list-top d-flex justify-content-between position-sti" :class="{ 'userlist-screenshot-listtop': isShow === true}">
            <div class="d-flex align-items-center date-userprofile-wrapper" v-if="isShow" @click="isShow = false">
                <img :src="backArrow">
                <h3 class="backClass black font-roboto-sans m-0">Back</h3>
            </div>
            <div class="d-flex align-items-center date-userprofile-wrapper" v-if="!isShow">
                <RangePickerComp 
                    class="rangeComp"
                    @SelectedDate="initData"
                    :clearable="true"
                    :preSelectable="false"
                />
                <!-- <img :src="closeIcon" v-if="Object.keys(selectedDates).length > 0" @click="initData()">  -->

                <div class="d-flex align-items-center userProfileFilter">
                    <UserProfile
                        v-for="user in users"
                        :key="user._id"
                        :showDot="false"
                        :data="{
                            image: user.profileImage ? user.profileImage : defaultUserIcon,
                            title: user.Employee_Name
                        }"
                        width="30px"
                        :thumbnail="'30x30'"
                        class="cursor-pointer timelog-user-status"
                        :class="[{'selected-blue-border-img border-radius-10-px': usersFilterIDsArray.includes(user._id)}]"
                        @click="usersFilter(user)"
                    />
                    <DropDown :id="'timeloguser_'+makeUniqueId(6)" v-if="users.length > 4" :bodyClass="{'timelog-usercount-dropdown' : true}">
                        <template #button>
                            <div class="d-flex align-items-center justify-content-center profile-image GunPowder blue text-nowrap border-2px-blue">
                                +{{users.length - 4}}
                            </div>
                        </template>
                        <template #options>
                            <DropDownOption
                                v-for="(user, index) in users.filter((x, index) => index >= 4).map((x) => ({...x,label: x.Employee_Name, image: x.profileImage}))"
                                :key="'user'+index"
                            >
                                <div class="d-flex align-items-center" :title="user.label">
                                    <input type="checkbox" :id="'checkbox'+user._id" v-model="user.isChecked" :class="[{'checkboxBlue' : user.isChecked}]"  @click="usersFilter(user)"/>
                                    <UserProfile
                                        :data="{title: user.label, image: user.image}"
                                        width="30px"
                                        :showDot="true"
                                        class="profile-image mr-5px"
                                        alt="user image"
                                        :class="[{'selected-blue-border-img border-radius-10-px': usersFilterIDsArray.includes(user._id)}]"
                                    />
                                    <span  class="userfilter-list" :class="{'font-size-16' : clientWidth <=767}">{{ user.label }}</span>
                                </div>
                            </DropDownOption>
                        </template>
                    </DropDown>
                </div>
            </div>
            <div class="d-flex align-items-center mobile-add-time">
                <div class="detailtimetrack d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center pr-15px">
                        <img class="greenPurpleDot" src="@/assets/images/svg/green_dot.svg"/>
                        <span class="trackedManualtime font-roboto-sans GunPowder">Tracked Time</span>
                    </div>
                    <div class="d-flex align-items-center">
                        <img class="greenPurpleDot" src="@/assets/images/svg/Purple_dot.svg">
                        <span class="trackedManualtime font-roboto-sans GunPowder">Manual Time</span>
                    </div>
                </div>
                <button class="btn btn-blue btn-default font-roboto-sans bg-blue border-primary white cursor-pointer" @click="openTimeSidebar()">Add Time</button>
            </div>
        </div>
        <TimeLogTable :task="task" :taskLogArray="taskLogArray" :noFoundMsg="noFoundMsg" :isSpinner="isSpinner" :isShow="isShow" @isView="(val) => {isShow=val}" @isDelete="deleteTimeLog" :totalTimeLog="totalCount" @updateEditTime="updateEditTime"/>
        <div class="d-flex mt-1" v-if="taskLogArray.length > 9 && isVisibleLoadMoreButton === true && allRecordCount > skip + limit">
            <button @click="commonGetQuery(true)" class="btn-class cursor-pointer">Load More</button>
        </div>
        <AddTimeLog v-if="activeTimeLog === true" :closeTimeLogSidebar="closeTimeLogSidebar" :isAddLog="isAddLog" :task="task" :modelValue="timeLogData" @addTime="addTime" />
    </div>
    <div v-else class="d-flex align-items-center justify-content-center w-100 h-100">
        <img :src="accessDeniedImage" alt="accessDenied">
    </div>
</template>

<script setup>
    import moment from 'moment';
    import { ref , inject ,defineProps, onMounted ,computed, defineComponent ,defineEmits } from 'vue'

    import { useStore } from 'vuex';
    import { useGetterFunctions, useCustomComposable } from "@/composable";

    import RangePickerComp from '@/components/molecules/RangePickerComp/RangePickerComp.vue';
    import UserProfile from "@/components/atom/UserProfile/UserProfile.vue";
    import DropDown from '@/components/molecules/DropDown/DropDown.vue'
    import DropDownOption from '@/components/molecules/DropDownOption/DropDownOption.vue'
    import  AddTimeLog  from '@/components/molecules/AddTimeLog/AddTimeLog.vue'
    import TimeLogTable from '@/components/molecules/TimeLogTable/TimeLogTable.vue';
    // import CheckboxComponent from '@/components/atom/Checkbox/CheckboxComponent.vue';
    import { mongodbCrudOperations } from '@/utils/MongoQueries/crudOperations/crudOperations'
    import { dbCollections } from '@/utils/FirebaseCollections';
    import { useRoute } from 'vue-router';

    const userId =  inject('$userId');
    const {getUser} = useGetterFunctions();
    const { getters } = useStore();
    const {makeUniqueId,checkApps} = useCustomComposable();
    const defaultUserIcon = inject("$defaultUserAvatar");
    const accessDeniedImage = require("@/assets/images/access_denied_img.png");

    defineComponent({
        components: {
            RangePickerComp,
            UserProfile,
            DropDown,
            DropDownOption,
            AddTimeLog,
            TimeLogTable
        }
    });

    const props = defineProps({
        task: {
            type: Object,
            required: true
        },
    })

    defineEmits(["isClose"])
    const clientWidth = inject('$clientWidth');
    const backArrow= require("@/assets/images/svg/back_arrow.svg");
    const dateRange = ref([]);
    const taskLogArray = ref([]);
    const usersData = ref(getters["users/users"]);
    const hiddenLogArr = ref([]);
    const usersFilterIDsArray = ref([]);
    const noFoundMsg = ref("");
    const timeLogData = ref({
        logTimeDate : new Date().toISOString().split('T')[0],
        startLogTime : '',
        endLogTime : '',
        timeDuration : '',
        description : '',
    })
    const activeTimeLog = ref(false);
    const isAddLog = ref(true);
    const isShow = ref(false);
    const route = useRoute();
    // const closeIcon = require("@/assets/images/svg/CloseSidebar.svg");
    const selectedDates = ref({})
    const skip = ref(0);
    const limit = ref(10);
    const isSpinner = ref(false)
    const isVisibleLoadMoreButton = ref(true);
    const lastVisible = ref(null);
    const users = ref([]);
    const totalCount = ref(0);
    const allRecordCount = ref(0);

    const dateFormat = computed(() =>  getters['settings/companyDateFormat']);

    onMounted(async() => {
        let date = new Date();
        dateRange.value.dateVal = [new Date(date.getFullYear(), date.getMonth(), 1), new Date(date.getFullYear(), date.getMonth() + 1, 0)];
        initData()
    })

    const initData = async(data = []) => {
        selectedDates.value = data;
        await commonGetQuery(false,false);
        await findUsersQuery();
    }

    const getAssigneeData = (row,cb) => {
        row.displaylogTimeDate = moment(new Date(row.LogStartTime * 1000)).format(dateFormat.value.dateFormat);
        row.duration = secondsToHms(row.LogTimeDuration);
        let duration = row.duration.split(":")
        duration.splice(2,1)
        let dur = duration.join(":");
        row.totalTimeDuration = dur;
        let user = getUser(row.Loggeduser);
        row.loggedUserName = user.Employee_Name;
        row.loggedUserProfile = user.Employee_profileImageURL;
        cb(row);
    }

    const secondsToHms = (a) => {
        var mins_num = parseFloat(a, 10);
        var hours   = Math.floor(mins_num / 60);
        var minutes = Math.floor((mins_num - ((hours * 3600)) / 60));
        var seconds = Math.floor((mins_num * 60) - (hours * 3600) - (minutes * 60));
        // Appends 0 when unit is less than 10
        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        return hours+':'+minutes;
    }

    const usersFilter = (obj) => {
        try {
            users.value.map((ele)=>{
                if(ele._id == obj._id) {
                    ele.isChecked = !ele.isChecked;
                }
                return ele;
            })
            let ind = usersFilterIDsArray.value.indexOf(obj._id);
            if(ind == -1){
                usersFilterIDsArray.value.push(obj._id);
                let tempArray = [];
                hiddenLogArr.value.filter((item) =>{
                if(usersFilterIDsArray.value.indexOf(item.Loggeduser) > -1){
                    tempArray.push(item)
                }
                });
                taskLogArray.value = tempArray;
            } else{
                usersFilterIDsArray.value.splice(ind, 1);
                let tempArray = [];
                hiddenLogArr.value.filter((item) =>{
                if(usersFilterIDsArray.value.indexOf(item.Loggeduser) > -1){
                    tempArray.push(item)
                }
                });
                taskLogArray.value = tempArray;
            }
            if(usersFilterIDsArray.value.length == 0|| usersFilterIDsArray.value == null){
                taskLogArray.value = hiddenLogArr.value;
            }
            if(taskLogArray.value.length === 0){
                noFoundMsg.value = "No Record Found";
            }
            commonGetQuery(false,false);
            findUsersQuery();
        } catch (error) {
            console.error(error,"ERROR");
        }
    }

    const openTimeSidebar = () => {
        let current = new Date();
        let user = getUser(userId.value);
        let result = null
        if(user.timeFormat == '12'){
            result = moment(current).format('hh:mm:A');
        }else{
            result = moment(current).format('HH:mm');
        }
        let timeString = result;
        let parts = timeString.split(":");
        let cleanedTimeString = parts[0] + ":" + parts[1] + " "  + parts[2];
        timeLogData.value = {
            logTimeDate : new Date().toISOString().split('T')[0],
            startLogTime : "",
            endLogTime : cleanedTimeString,
            timeDuration : '',
            description : '',
        }
        activeTimeLog.value = true;
    }

    const closeTimeLogSidebar = () => {
        activeTimeLog.value=false;
        timeLogData.value = {
            logTimeDate : new Date().toISOString().split('T')[0],
            startLogTime : '',
            endLogTime : '',
            timeDuration : '',
            description : '',
        }
    }

    function commonGetQuery(loadMore = false,isDelete = false) {
        let startDate;
        let endDate;
        if(selectedDates.value?.dateVal && selectedDates.value?.dateVal !== null) {
            startDate = selectedDates.value.dateVal[0];
            endDate = selectedDates.value.dateVal[1];
            startDate.setHours(0,0,0);
            endDate.setHours(23,59,59,999);
        }
        isSpinner.value = true;
        if(loadMore){
            if(isDelete === false){
                skip.value += limit.value;
            }
        } else {
            skip.value = 0;
            taskLogArray.value = [];
        }
        let queryObj = [
            {
                $match: 
                    {
                        $and: [
                            {TicketID: `${props.task?._id ? props.task._id : route.params.taskId}`},
                        ]
                    }
            },
            {$sort: {createdAt: -1,_id: 1}}
        ]
        if(startDate && endDate){
            queryObj[0].$match.$and[0].LogStartTime = {
                $gte: new Date(startDate).getTime() / 1000,
                $lte: new Date(endDate).getTime() / 1000
            };
        }
        if(usersFilterIDsArray.value.length > 0){
            queryObj[0].$match.$and[0].Loggeduser = {
                $in: usersFilterIDsArray.value
            };
        }
        const data = {
            type: 'aggregate',
            collection: dbCollections.TIMESHEETS,
            data: [[
                ...queryObj,
                {
                    $facet: {
                        result:[
                            { $skip: skip.value},
                            { $limit: limit.value}
                        ],
                        count:[
                            {$count: "count" }
                        ]
                    }
                }
            ]]
        }
        mongodbCrudOperations(data)
        .then((response) => response?.[0])
        .then((response) => {
            const res = response.result;
            allRecordCount.value = response?.count?.[0].count;
            isVisibleLoadMoreButton.value =true;
            if(res.length == 0){
                isVisibleLoadMoreButton.value = false;
                isSpinner.value = false;
                return;
            }
            res.forEach((change) => {
                let logData = {...change};
                getAssigneeData(logData,(result)=>{
                    let valKey = taskLogArray.value.findIndex(x => x._id === result._id);
                    if(valKey <= -1){
                        taskLogArray.value.push(result);
                    }
                })
            })
            lastVisible.value = res[res.length -1];
            isSpinner.value = false;
        })
        .catch((error) => {
            isSpinner.value = false;
            console.error('ERROR in getting timelog' , error);
        })
        hiddenLogArr.value = taskLogArray.value;
        if(usersFilterIDsArray.value.length > 0){
            let tempArray = [];
            hiddenLogArr.value.filter((item) =>{
            if(usersFilterIDsArray.value.indexOf(item.Loggeduser) > -1){
                tempArray.push(item)
            }
            });
            taskLogArray.value = tempArray;
        }
        if(taskLogArray.value.length == 0){
            noFoundMsg.value = "No Record Found";
        }
    }

    function findUsersQuery() {
        let startDate;
        let endDate;
        if(selectedDates.value?.dateVal && selectedDates.value?.dateVal !== null) {
            startDate = selectedDates.value.dateVal[0];
            endDate = selectedDates.value.dateVal[1];
            startDate.setHours(0,0,0);
            endDate.setHours(23,59,59,999);
        }
        let queryObj = [
            {
                $match: 
                    {
                        $and: [
                            {TicketID: `${props.task?._id ? props.task._id : route.params.taskId}`},
                        ]
                    }
            },
            {
                $group: {
                    _id: "$Loggeduser",
                    count: {$sum: '$LogTimeDuration'}
                }
            }
        ]
        if(startDate && endDate){
            queryObj[0].$match.$and[0].LogStartTime = {
                $gte: new Date(startDate).getTime() / 1000,
                $lte: new Date(endDate).getTime() / 1000
            };
        }
        if(usersFilterIDsArray.value.length > 0){
            queryObj[0].$match.$and[0].Loggeduser = {
                $in: usersFilterIDsArray.value
            };
        }
        const data = {
            type: 'aggregate',
            collection: dbCollections.TIMESHEETS,
            data: [queryObj]
        }
        mongodbCrudOperations(data).then((response) => {
            let tempTaskAssigne = [];
            totalCount.value = 0;
            response.forEach((user) => {
                totalCount.value += user.count;
                let index = tempTaskAssigne.findIndex((IDS) => IDS === user._id);
                let tempArray = [];
                if(index === -1) {
                    tempTaskAssigne.push(user._id);
                    usersData.value.map((item)=>{
                        if(tempTaskAssigne.includes(item._id)){
                            tempArray.push({...item,'profileImage':item.Employee_profileImageURL ? item.Employee_profileImageURL : '',isChecked: false})
                        }
                    })
                    if(usersFilterIDsArray.value.length === 0){
                        users.value = tempArray
                    }
                }
            })
        })
    }

    function addTime(event) {
        getAssigneeData(event,(result)=>{
            let valKey = taskLogArray.value.findIndex(x => x._id === result._id);
            if(valKey <= -1){
                taskLogArray.value.unshift(result);
            }
        })
        findUsersQuery();
    }

    function deleteTimeLog (event,data) {
        let index = taskLogArray.value.findIndex((x) => x._id === data._id);
        if(index > -1){
            taskLogArray.value.splice(index,1);
        }
        commonGetQuery(true,true);
        findUsersQuery();
    }

    function updateEditTime (event) {
        let index = taskLogArray.value.findIndex((x) => x._id === event._id);
        if(index !== -1){
            getAssigneeData(event,(result)=>{
                let prevTimeDuration = taskLogArray.value[index].LogTimeDuration;
                let newTimeDuration = result.LogTimeDuration;
                totalCount.value = totalCount.value - prevTimeDuration + newTimeDuration;
                taskLogArray.value[index] = result;
            })
        }
    }

</script>

<style src="./style.css">
</style>