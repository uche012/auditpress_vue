<template>
    <td class="view-item"> 
        <div>
            {{index}} 
        </div>
    </td>
    <td class="view-item"> 
        <div>
            <img v-if="!showArchiveVar" :src="favourite ? filledStar : blankStar" @click.stop="markAsFavourite()" alt="favourite star" class="cursor-pointer ml-6px">
            <img v-else :src="favourite ? filledStar : blankStar" alt="favourite star" class="ml-6px">
        </div>
    </td>
    <td class="view-item"> 
        <div>
            <img v-if="taskType?.taskImage?.includes('http')" :src="taskType?.taskImage" alt="task_type" :title="taskType?.name"  class="task__type-image vertical-middle">
            <WasabiImage 
                v-else
                class="vertical-middle task__type-image"
                :data="{url: taskType?.taskImage}"
            />
            <!-- <img :src="taskType.taskImage" alt="task_type" :title="taskType.name" class="ml-10px vertical-middle task__type-img"> -->
        </div>
    </td>
    <td class="view-item" :class="{'cursor-pointer': !showArchiveVar}" @click="!showArchiveVar ? changeRoute('task-detail-tab') : ''">
        <div class="d-flex align-items-center">
            <img v-if="task?.ParentTaskId" :src="subTaskIcon" alt="">
            <span class="word-break-all d-block" :class="{'ml-1': task?.ParentTaskId}"> {{task.TaskName}} </span>
        </div>
    </td>
    <td class="view-item"> 
        <div class="d-flex">
            <span>
                <span class="chat-main-new position-re"  @click.stop="!showArchiveVar ? changeRoute() : ''">
                    <img :src="chatIcon" alt="chatIcon" :class="{'cursor-pointer': !showArchiveVar}">
                    <div class="count-block position-ab" v-if="myCounts">
                        {{myCounts}}
                    </div>
                </span>
            </span>
        </div>
    </td>

    <td class="view-item" v-if="checkPermission('task.task_status',projectData?.isGlobalPermission) !== null"> 
        <div class="d-flex table_view-status m-ll-10"> 
            <TaskStatus
            :id="task._id+'status'"
            :showLabel="true"
            :modelValue="taskStatus"
            :disabled="showArchiveVar && checkPermission('task.task_list',projectData?.isGlobalPermission)!==true || checkPermission('task.task_status',projectData?.isGlobalPermission) !== true || showArchiveVar !== false"
            :options="projectStatus"
            @select="changeStatus($event)"
            />  
        </div>
    </td>
    <td class="view-item" v-if="checkPermission('task.task_assignee',projectData?.isGlobalPermission) !== null"> 
        <div class="d-flex"> 
            <span>
                <Assignee
                v-if="checkPermission('task.task_assignee',projectData?.isGlobalPermission) === true && checkPermission('task.task_list',projectData?.isGlobalPermission) == true"
                :users="task.AssigneeUserId"
                :options="permittedOptions"
                :num-of-users="2"
                imageWidth="30px"
                :addUser="!showArchiveVar"
                @selected="changeAssignee(checkApps('MultipleAssignees',projectData) ? 'add' : 'replace', $event)"
                @removed="changeAssignee('remove', $event)"
                :isDisplayTeam="true"
                :multiSelect="checkApps('MultipleAssignees')"
                />
                <Assignee
                v-else
                :users="task.AssigneeUserId"
                :options="nonPermittedOptions"
                :num-of-users="2"
                imageWidth="30px"
                :addUser="!showArchiveVar"
                @selected="changeAssignee(checkApps('MultipleAssignees',projectData) ? 'add' : 'replace', $event)"
                @removed="changeAssignee('remove', $event)"
                :isDisplayTeam="true"
                :multiSelect="checkApps('MultipleAssignees')"
                />
            </span>
        </div>
    </td>
    <td class="view-item" v-if="checkPermission('task.task_due_date',projectData?.isGlobalPermission) !== null"> 
        <div class="text-center"> 
            <span>
                <DueDateCompo
                id="due-date-task"
                :overdue="true"
                :displyDate="dueDate ? dueDate :''"
                :disabledDates="task.dueDateDeadLine"
                @SelectedDate="($event) => updateDueDate($event)"
                v-if="!showArchiveVar && checkPermission('task.task_due_date',projectData?.isGlobalPermission) === true && checkPermission('task.task_list',projectData?.isGlobalPermission) == true && showArchiveVar === false"
                />
                <template v-else>
                    <span v-if="task.DueDate" :style="[{'color': task.DueDate< new Date() ? 'red' :'black'}]" class="word-break-all d-block">{{convertDateFormat(task.DueDate,'',{showDayName:false})}}</span>
                    <span class="word-break-all d-block" v-else>No Due Date</span>
                </template>
            </span>
        </div>
    </td>
    <td class="view-item" v-if="checkPermission('task.task_priority',projectData?.isGlobalPermission) !== null && checkApps('Priority')"> 
        <div class="d-flex"> 
            <span>
            <Priority
            :priorityVal="task.Task_Priority"
            @select="updatePriority"
            :permission="!showArchiveVar && checkPermission('task.task_priority',projectData?.isGlobalPermission) === true"
            />
            </span>
        </div>
    </td>
    <td class="view-item"> 
        <div class="word-break-all d-block">{{task.TaskKey}} </div>
    </td>
</template>      
<script setup>
import { inject ,computed ,ref , watch} from 'vue';
import WasabiImage from "@/components/atom/WasabiIamgeCompp/WasabiIamgeCompp.vue";
import taskClass from "@/utils/TaskOperations";
import { useToast } from "vue-toast-notification"
import {useGetterFunctions , useCustomComposable , useMoment , useConvertDate} from '@/composable'
import { useStore } from 'vuex'
import TaskStatus from '@/components/atom/TaskStatus/TaskStatus.vue'
import { useRouter, useRoute } from "vue-router"
import { taskDueDateAdd, taskDueDateChange } from "@/utils/NotificationTemplate"
import DueDateCompo from '@/components/molecules/DueDateCompo/DueDateCompo.vue';
import Assignee from "@/components/molecules/Assignee/Assignee.vue"
import Priority from "@/components/molecules/PriorityCompo/PriorityComp.vue"


const {changeDateFormate} = useMoment();
const {checkPermission, checkApps,getWasabiImageLink} = useCustomComposable();
const {getUser , getPriority} = useGetterFunctions();
const props = defineProps({
    data:{
        type:Object
    },
    index:{
        type:Number
    },
    taskData: {
        type:Object
    },
    parentAssignee:{
        type:Array
    }
})

const chatIcon = require("@/assets/images/svg/ChatIcon.svg");
const subTaskIcon = require("@/assets/images/png/subTaskIcon.png");
const route = useRoute()
const router = useRouter()
const showArchiveVar = inject("showArchived");
const task = ref(props.data)
const { getters } = useStore()
const projectData  = inject('selectedProject')
const statusSearch = ref("");
const $toast = useToast()
const userId = inject('$userId');
const companyId = inject('$companyId')
const dueDate = computed(() => props.data.DueDate)
const dateFormat = inject('$dateFormat');
const { convertDateFormat } = useConvertDate();
const filledStar = require("@/assets/images/svg/start10.svg");
const blankStar = require("@/assets/images/svg/blankStar.svg");


const companyOwner = computed(() => {
    return getters["settings/companyOwnerDetail"];
})

watch(props.taskData, () => {
    task.value = props.data;
})

watch(() => props.data, (newVal, oldVal) => {
    // task.value = newVal
    if(JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
        task.value = newVal;
    }
})

const projectStatus = computed(() => {
    return projectData.value.taskStatusData.filter((x) => x.name.toLowerCase().includes(statusSearch.value.toLowerCase()))
})

const taskStatus = computed(() => {
    return projectData.value.taskStatusData.find((x) => x.key === props.data.statusKey)
})

const myCounts = computed(() => {
    let total = 0;
    if(getters["users/myCounts"]?.data?.[`task_${projectData.value._id}_${task.value.sprintId}_${task.value._id}_comments`]) {
        total += getters["users/myCounts"]?.data?.[`task_${projectData.value._id}_${task.value.sprintId}_${task.value._id}_comments`] || 0
    }
    return total;
})

const taskType = computed(() => {
    return projectData.value.taskTypeCounts.find((x) => x.key === task.value.TaskTypeKey)
})

const favourite = computed(() => {
    return props.data.favouriteTasks && props.data.favouriteTasks.length && props.data.favouriteTasks.filter((x) => userId.value && x === userId.value).length;
})

const sprintData = computed(() => {
    let sprintData = false;
    if (projectData.value && props.data) {
        sprintData = props.data.folderObjId ? projectData.value?.sprintsfolders?.[props.data.folderObjId]?.sprintsObj?.[props.data.sprintId] : projectData.value?.sprintsObj?.[props.data.sprintId]
    }

    return sprintData || null;
})

const nonPermittedOptions = computed(() => {
    let users = [];
    if(sprintData.value) {
        if(props.data.isParentTask) {
            if(sprintData.value?.private) {
                users = (sprintData.value?.AssigneeUserId || []).filter((x) => x === userId.value);
            } else {
                if(projectData.value?.isPrivateSpace) {
                    users = (projectData.value?.AssigneeUserId || []).filter((x) => x === userId.value);
                } else {
                    users = [userId.value];
                }
            }
        } else {
            users = (props.parentAssignee || [])?.filter((x) => x === userId.value)
            if(sprintData.value?.private) {
                users = users.filter((x) => sprintData.value?.AssigneeUserId?.includes(x))
            }
        }
    }
    if(projectData.value?.isPrivateSpace) {
        users = users.filter((x) => projectData.value?.AssigneeUserId.includes(x));
        return users;
    } else {
        return users;
    }
})

const companyUsers = computed(() => getters["settings/companyUsers"]?.map((x) => x.userId))
const permittedOptions = computed(() => {
    let users = [];
    if(sprintData.value) {
        if(props.data.isParentTask) {
            if(sprintData.value?.private) {
                users = sprintData.value?.AssigneeUserId || [];
            } else {
                if(projectData.value?.isPrivateSpace) {
                    users = projectData.value?.AssigneeUserId || [];
                } else {
                    users = companyUsers.value;
                }
            }
        } else {
            if(sprintData.value?.private) {
                users = props.parentAssignee.filter((x) => sprintData.value?.AssigneeUserId?.includes(x))
            } else {
                users = props.parentAssignee
            }
        }
    }
    if(projectData.value?.isPrivateSpace) {
        users = users.filter((x) => projectData.value?.AssigneeUserId.includes(x));
        return Array.from(new Set([...users, ...(props.data?.AssigneeUserId || [])]));
    } else {
        return users;
    }
})

function changeStatus(status) {
    const statusIndex = projectData.value.taskStatusData.findIndex((x) => x.key === props.data.statusKey);
    if(statusIndex === -1) return;

    const userData = getUserData();
    const prev = {
        backColor: projectData.value.taskStatusData[statusIndex].bgColor,
        color: projectData.value.taskStatusData[statusIndex].textColor,
        statusName: projectData.value.taskStatusData[statusIndex].name,
    }
    const updatedStatus = {
        'text': status.name,
        'key': status.key,
        'type': status.type,
        'value': status.value,
    }
    const newStatus = {
        status: updatedStatus,
        'statusType': status.type,
        'statusKey': status.key
    }
    let prevStatus = {
        ...prev,
        'taskName': props.data.TaskName,
        'bgColor': status.bgColor,
        'textColor': status.textColor,
        'taskId': props.data._id,
        'updatedTaskName': status.name,
    }

    const project = {
        _id: projectData.value._id,
        CompanyId: projectData.value.CompanyId,
        lastTaskId: projectData.value.lastTaskId,
        ProjectName: projectData.value.ProjectName,
        ProjectCode: projectData.value.ProjectCode
    }
    taskClass.updateStatus({ newStatus, prevStatus, projectData: project, task: props.data, userData})
    .then(() => {
        $toast.success(`Status changed successfully`, {position: "top-right"})
    })
    .catch((error) => {
        console.error("ERROR in changeStatus: ", error);
    })
}


function changeRoute(tab ='') {
    const paramsObj = {
        cid: companyId.value,
        id: projectData.value._id,
        sprintId: task.value.sprintId,
        taskId: task.value._id
    }

    if(task.value.folderObjId) {
        paramsObj.folderId = task.value.folderObjId;
    }
    router.push({
        name: task.value.folderObjId? 'ProjectFolderSprintTask' : 'ProjectSprintTask',
        params: paramsObj,
        query: {...route.query, detailTab: !tab ? "comment" : tab}
    })
}

function getUserData() {
    const user = getUser(userId.value);
    const userData = {
        id: user.id,
        Employee_Name: user.Employee_Name,
        companyOwnerId: companyOwner.value.userId,
    }
    return userData;
}

const updateDueDate = (event) => {
    try {
        const userData = getUserData();

        let newdueDateDeadLine = [];
        if(props.data.dueDateDeadLine.length > 0) {
            props.data.dueDateDeadLine.forEach((date) => {
                newdueDateDeadLine.push({ date: new Date(date.date * 1000) })
            })
            newdueDateDeadLine.push({ date: new Date(event.dateVal)});
        } else {
            newdueDateDeadLine.push({ date: new Date(event.dateVal)});
        }
        let typesenseDeadLine = JSON.parse(JSON.stringify(newdueDateDeadLine));
        typesenseDeadLine.forEach(day => {
            day.date = new Date(day.date)
        })
        const updateobj = {
            DueDate: event.dateVal,
            dueDateDeadLine: newdueDateDeadLine
        }
        const typesensObj = {
            DueDate: new Date(event.dateVal),
            dueDateDeadLine: typesenseDeadLine.map((x) => x)
        }
        let notificationObj = {
            key: "task_due_date",
            projectId: props.data.ProjectID,
            taskId: props.data._id,
            sprintId: props.data.sprintId
        }
        let obj = {
            'ProjectName' : projectData.value.ProjectName,
            'TaskName' : props.data.TaskName,
        }
        if(props.data.dueDateDeadLine.length > 0 ) {
            obj.previousDate = changeDateFormate(new Date(props.data.dueDateDeadLine[props.data.dueDateDeadLine.length - 1].date))
            obj.changedDate = changeDateFormate(event.dateVal)
            notificationObj.message = taskDueDateChange(obj);
        } else  {
            obj.lastDate = changeDateFormate(event.dateVal)
            notificationObj.message = taskDueDateAdd(obj);
        }
        const project = {
            _id: projectData.value._id,
            CompanyId: projectData.value.CompanyId,
            lastTaskId: projectData.value.lastTaskId,
            ProjectName: projectData.value.ProjectName,
            ProjectCode: projectData.value.ProjectCode
        }

        taskClass.updateDueDate({
            commonDateFormatString: dateFormat.value,
            firebaseObj: updateobj,
            typesenseObj: typesensObj,
            project: project,
            task: props.data,
            obj: notificationObj,
            userData
        }).then(() => {
            $toast.success(`Due date updated successfully`, {position: "top-right"})
        }).catch((error) => {
            console.error("ERROR in updateDueDate: ", error);
        })
        } 
    catch (error) {
        console.error("ERROR in updateDueDate: ", error);
    }
}

function changeAssignee(type, value) {
    if(!value?.id) return;
    const userData = getUserData();
    let operation = ""

    if(type === "add") {
        operation = "assigneeAdd"
    } else if(type === 'remove') {
        operation = "assigneRemove"
    } else if(type === 'replace') {
        operation = "replace"
    }

    let updateObject = {
        AssigneeUserId : value.id
    }

    const project = {
        _id: projectData.value._id,
        CompanyId: projectData.value.CompanyId,
        lastTaskId: projectData.value.lastTaskId,
        ProjectName: projectData.value.ProjectName,
        ProjectCode: projectData.value.ProjectCode
    }

    taskClass.updateAssignee({
        firebaseObj: updateObject,
        projectData: project,
        taskData: props.data,
        employeeName: getUser(value.id).Employee_Name,
        type: operation,
        userData
    })
    .then(() => {
        $toast.success(`Assignee changed successfully`, {position: "top-right"})
    })
    .catch((error) => {
        console.error("ERROR in changeAssignee: ", error);
    })
}

async function updatePriority(val) {
    const userData = getUserData();

    let updateObj = {
        Task_Priority : val.value
    }

    let project = {
        '_id': projectData.value._id ? projectData.value._id : "",
        'ProjectName' : projectData.value.ProjectName,
        "CompanyId": companyId.value,
    }

    const priority = getPriority(props.data.Task_Priority)

    let priorityObj = {
        'statusImage' : await getWasabiImageLink(projectData.value.CompanyId,priority.image),
        'priorityName' : priority.name,
        'taskId': props.data._id,
        'taskName': props.data.TaskName,
        'userName' : userData.Employee_Name,
        'newStatusImage' : await getWasabiImageLink(projectData.value.CompanyId,val.image),
        'newPriorityName' : val.name
    }

    taskClass.updatePriority({firebaseObj: updateObj, projectData: project, taskData: props.data, priorityObj, userData})
    .then(() => {
        $toast.success(`Task updated successfully`, {position: "top-right"})
    })
    .catch((error) => {
        console.error("ERROR in update priority: ", error);
    })
}

function markAsFavourite() {
    taskClass.markAsFavourite({
        companyId: projectData.value.CompanyId,
        projectId: projectData.value._id,
        sprintId: props.data.sprintId,
        taskData: props.data,
        userId: userId.value,
    })
    .then((res) => {
        $toast.success(res.statusText, {position: "top-right"})
    })
    .catch((error) => {
        console.error("ERROR in markAsFavourite: ", error);
    })
}

</script>
<style scoped>
@import './style.css'
</style>