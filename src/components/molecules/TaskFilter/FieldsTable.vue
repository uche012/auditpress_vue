<template>
    <div class="fieldTable">
        <div class="mb-010 custom-filters-table" :id="`num-${index}`" v-for="(item, index) in inputs" :key="index" >
            <div class="d-flex align-items-center custom-filters-detailwrapper">
                <div class="mr-010 custom-filters-col" v-if="index == 0">
                    <span class="where-title" :class="{'font-size-13 text-center' : clientWidth > 767 , 'font-size-18 text-left' : clientWidth <= 767}" :style="{color : clientWidth > 767 ? '#959595' : '#000000' }">
                        Where
                    </span>
                </div>
                <div class="mr-010 custom-filters-col" v-if="index == 1">
                    <div class="custom-radio position-re" :class="{'d-flex' : clientWidth <= 767}">
                        <input type="radio" :id="'condition'+index" :value="item.condition === '&&' ? '||' : '&&'" v-model="item.condition" :disabled="index !== 1" @change="setAllOptions(item)"/>
                        <label :for="'condition'+index"  :class="{'font-size-13 text-center' : clientWidth > 767 , 'font-size-18 text-left' : clientWidth <= 767}"
                            :style="{color : clientWidth > 767 ? '#959595' : '#000000' }"
                            >{{ item.condition === '&&' ? 'And' : 'Or' }}
                            <img class="mobile_icon_dropdown" src="@/assets/images/svg/drop_down_mobile.svg" alt="dropdown" v-if="clientWidth <= 767">
                        </label>
                        <img src="@/assets/images/svg/toggle_arrow.svg" alt="" width="9" class="up-downarrow position-ab" v-if="clientWidth > 767"/>
                        <span class="remove_icon"  v-if="inputs.length > 1 && clientWidth <= 767" @click="$emit('delete', { item, index })" :class="{'d-flex align-items-center cursor-pointer font-size-16' : clientWidth <= 767 }"> Remove </span>               
                    </div>
                </div>
                <div class="mr-010 custom-filters-col" v-if="index > 1">
                    <span class="where-title"  :class="{'font-size-13 text-center' : clientWidth > 767 , 'font-size-18 text-left' : clientWidth <= 767}" :style="{color : clientWidth > 767 ? '#959595' : '#000000' }"> 
                        {{ item.condition === '&&' ? 'And' : 'Or' }}
                        <span class="remove_icon"  v-if="inputs.length > 1 && clientWidth <= 767" @click="$emit('delete', { item, index })" :class="{'d-flex align-items-center cursor-pointer font-size-16' : clientWidth <= 767 }"> Remove </span>
                    </span>
                </div>
                <div class="mr-010 custom-filters-col filter-status-fieldwrapper">
                    <CustomDropDown :maxWidth="clientWidth > 767 ? '150px' : '100%'" :bodyClass="{'filter-status-dropdpown' : true}">
                        <template #head v-if="clientWidth <= 767">
                            <div class="d-flex align-items-center justify-content-between cancel-title-donewrapper">
                                <a href="#" class="mr-10px"  @click.stop.prevent="$refs.keyRefs[index].click(), inputName='', isInvalid=false" :class="{'font-size-16' : clientWidth <= 767 }" :style="{color : clientWidth <= 767 ? '#646464' : '#2F3990'}">Cancel</a>
                                <h3 class="filter-dropdownmobile-title" :class="{'font-size-20 font-weight-500' : clientWidth <= 767 }" :style="{color : clientWidth <= 767 ? '#090A0A' : ''}">Filtering Field</h3>
                                <span class="done" @click="$refs.keyRefs[index].click()">Done</span>
                            </div>
                        </template>
                        <template #button>
                            <div ref="keyRefs" :class="{'font-size-13' : clientWidth > 767 , 'font-size-14' : clientWidth <= 767}" :style="{color : clientWidth > 767 ? '#818181' : '#B3B3B3' }" :title="Object.keys(item.name).length > 0 ? item.name.name : 'Select'">{{ Object.keys(item.name).length > 0 ? item.name.name : "Select"}}</div>
                        </template>
                        <template #options>
                            <div v-if="mainOptions.length > 0">
                                <div v-for="(option, i) in mainOptions" :key="i" class="cursor-pointer filter-status-field" @click="$refs.keyRefs[index].click(), resetFields(item), handleSelected('keys', item, option, index)">
                                    <span class="font-size-14 font-weight-400">{{ option.name }}</span>
                                </div>
                            </div>
                            <div v-else class="font-size-13 gray81">No date found</div>
                        </template>
                    </CustomDropDown>
                </div>
                <div class="mr-010 custom-filters-col filter-operator" v-if="Object.keys(item.name).length > 0">
                    <CustomDropDown :maxWidth="clientWidth <= 767 ? '100%' : '101px'" :bodyClass="{'filter-operation-dropdown' : true}">
                        <template #head v-if="clientWidth <= 767" >
                            <div class="d-flex align-items-center justify-content-between cancel-title-donewrapper">
                                <span class="cancel" @click="$refs.compRef[index].click()"> Cancel </span>
                                <h3 class="filter-dropdownmobile-title">Filter Operator</h3>
                                <span class="done" @click="$refs.compRef[index].click()">Done</span>
                            </div>
                        </template>
                        <template #button>
                            <span ref="compRef" class="text-ellipsis d-block select-compRef" :class="{'font-size-13' : clientWidth > 767 , 'font-size-14' : clientWidth <= 767}" :style="{color : clientWidth > 767 ? '#818181' : '#B3B3B3' }" :title="Object.keys(item.name).length > 0 ? item.name.name : 'Select'">{{ Object.keys(item.comparison).length > 0 ? item.comparison.name : "Select"}}</span>
                        </template>
                        <template #options>
                            <div v-for="(option, i) in item.comparisonsData" :key="i" class="cursor-pointer filter-status-field" @click="$refs.compRef[index].click(), handleSelected('comparison', item, option)">
                                <span class="font-weight-400" :class="{'font-size-14' : clientWidth > 767 , 'font-size-16' : clientWidth <= 767}">{{ option.name }}</span>
                            </div>
                        </template>
                    </CustomDropDown>
                </div>
                <div class="mr-010 custom-filters-col">
                    <CustomDropDown v-if="arrayKeys.includes(item?.name.value)" :style="{marginBottom : clientWidth <= 767 ? '20px !important' : '0' }"  :maxWidth="clientWidth > 767 ? '211px' : '100%'"  :bodyClass="{'filter-selectall-options' : true}">
                        <template #head v-if="clientWidth <= 767">
                            <div class="d-flex align-items-center justify-content-between cancel-title-donewrapper">
                                <span class="cancel" @click="$refs.fieldOptionsRef[index].click()"> Cancel </span>
                                    <span v-if="item.name.value === 'statusKey'"  class="filter-dropdownmobile-title">Select Status</span>
                                    <span v-if="item.name.value === 'Task_Priority'"  class="filter-dropdownmobile-title">Select Priorities</span>
                                    <span v-if="item.name.value === 'TaskTypeKey'"  class="filter-dropdownmobile-title">Select Task Type</span>
                                    <span v-if="item.name.value === 'Task_Leader'"  class="filter-dropdownmobile-title">Select Reporter</span>
                                    <span v-if="item.name.value === 'tagsArray'"  class="filter-dropdownmobile-title">Select Tags</span>
                                <span class="done" @click="$refs.fieldOptionsRef[index].click()">Done</span>
                            </div>
                        </template>
                        <template #button>
                            <div ref="fieldOptionsRef" class="selected-options d-flex align-items-center">
                                <span class="ml-010" :class="{'font-size-13' : clientWidth > 767 , 'font-size-14' : clientWidth <= 767 }"  :style="{color : clientWidth > 767 ? '#818181' : '#B3B3B3' }" v-if="item.values.length === 0" > Select Options</span>

                                <div class="d-flex align-items-center" v-if="item.name.value === 'statusKey'">
                                    <span v-for="(option, i) in item.displayData" :key="i">
                                        <span v-if="i < numberOfItem" class="d-flex align-items-center">
                                            <span class="status_square m0px-6px" :title="option.name" :style="{'background-color': option.textColor}"></span>
                                            <span class="mr-5-px" :class="{'font-size-12' : clientWidth > 767 , 'font-size-14' : clientWidth <= 767 }">{{ option.name }}</span>
                                        </span>
                                    </span>
                                    <span v-if="item.displayData.length > numberOfItem" class="mr-5-px span-count" :class="{'font-size-12' : clientWidth > 767 , 'font-size-14' : clientWidth <= 767 }">+{{ item.displayData.length - numberOfItem}}</span>
                                </div>
                                <div class="d-flex align-items-center" v-if="item.name.value === 'Task_Priority'">
                                    <span v-for="(option, i) in item.displayData" :key="i">
                                        <span v-if="i < numberOfItem" class="d-flex align-items-center">
                                            <img v-if="option.statusImage" :src="option.statusImage" alt="" height="10" width="10" :style = "{margin:  clientWidth > 767 ? '0px 5px' : '0px 8px 0 13px'}"/>
                                            <span class="mr-5-px" :class="{'ml-5-px': !option.statusImage, 'font-size-12' : clientWidth > 767 , 'font-size-14' : clientWidth <= 767 }">{{ option.name }}</span>
                                        </span>
                                    </span>
                                    <span v-if="item.displayData.length > numberOfItem" class="mr-5-px span-count" :class="{'font-size-12' : clientWidth > 767 , 'font-size-14' : clientWidth <= 767 }">+{{ item.displayData.length - numberOfItem}}</span>
                                </div>
                                <div class="d-flex align-items-center" v-if="item.name.value === 'TaskTypeKey'">
                                    <span v-for="(option, i) in item.displayData" :key="i">
                                        <span v-if="i < numberOfItem" class="d-flex align-items-center">
                                            <img v-if="option.taskImage" :src="option.taskImage" alt="" height="13" width="13" :style = "{margin:  clientWidth > 767 ? '0px 5px' : '0px 8px 0 13px', width : clientWidth > 767 ? '13px' : '16px', height : clientWidth > 767 ? '13px' : '16px'}" class="border-radius-2-px" />
                                            <span class="font-size-12 mr-5-px" :class="{'ml-5-px': !option.taskImage, 'font-size-12' : clientWidth > 767 , 'font-size-14' : clientWidth <= 767}">{{ option.name }}</span>
                                        </span>
                                    </span>
                                    <span v-if="item.displayData.length > numberOfItem" class="font-size-12 mr-5-px span-count">+{{ item.displayData.length - numberOfItem}}</span>
                                </div>
                                <div class="d-flex align-items-center" v-if="item.name.value === 'Task_Leader'">
                                    <span v-for="(option, i) in item.displayData" :key="i">
                                        <span v-if="i < numberOfItem" class="d-flex align-items-center">
                                            <!-- <img v-if="option.image" :src="option.image" alt="" :title="option.name"   class="task__leader-img"/> -->
                                            <WasabiIamgeCompp class="task__leader-img" :data="{url: option.image}" :userImage="true" v-if="option.image" :title="option.name"/>
                                        </span>
                                    </span>
                                    <span v-if="item.displayData.length > numberOfItem" class="font-size-12 mr-5-px span-count">+{{ item.displayData.length - numberOfItem}}</span>
                                </div>
                                <div class="d-flex align-items-center" v-if="item.name.value === 'tagsArray'">
                                    <span v-for="(option, i) in item.displayData" :key="i">
                                        <span v-if="i < numberOfItem" class="d-flex align-items-center">
                                            <span class="ml-5-px border-radius-12-px font-size-12 tags__array" :style="{'background-color': option.tagBgColor, 'color': option.tagColor }">{{ option.name }}</span>
                                        </span>
                                    </span>
                                    <span v-if="item.displayData.length > numberOfItem" class="font-size-12 ml-5-px mr-5-px span-count">+{{ item.displayData.length - numberOfItem}}</span>
                                </div>
                                <img :src="clientWidth > 767 ? selectArrow : selectArrowMobile" alt="dropdown" width="13" class="position-ab select__arrow">
                            </div>
                        </template>
                        <template #options>
                            <div class="tasks-statustags-wrapper">
                                <div v-if="item.name.value === 'statusKey' && statusArray.length" :class="{'width-211-px': clientWidth > 767, 'w-100' : clientWidth <= 767}">
                                    <div v-if="statusArray.length">
                                        <label :for="'selectAll'+index" class="cursor-pointer d-flex align-items-center label-all">
                                            <div class="d-flex align-items-center check__component-wrapper">
                                                <CheckboxComponent :id="'selectAll'+index" v-model="item.isAllChecked" :value="item.isAllChecked" @click="allSelect(item)" customClasses=""/>
                                                <span class="ml-5-px" :class="{'font-size-12 blue' : clientWidth > 767 , 'font-size-16' : clientWidth <= 767 }" >Select All</span>
                                            </div>
                                            <!-- <img src="@/assets/images/svg/help_icon.svg" alt="" height="14" width="14" @click.stop.prevent=""/> -->
                                        </label>
                                        <div class="checkbox-dropdown-wrapper">
                                            <div v-for="(option, i) in statusArray" :key="i" class="dropdown-item checkbox-dropdown" :class="{'border-radius-6-px' : clientWidth > 767 , 'border-radius-8-px' : clientWidth <= 767}">
                                                <label :for="'status'+i" class="cursor-pointer d-flex align-items-center lebel-items font-size-14 GunPowder">
                                                    <CheckboxComponent :id="'status'+i" :value="option.key" v-model="item.values" @change="handleChecked(item)" classes="filer-checkbox"/>
                                                    <span class="status_square" :title="option.name" :style="{'background-color': option.textColor , margin:  clientWidth > 767 ? '0px 6px' : '0px 8px 0 13px'}"></span>
                                                    <span :class="{'font-size-14' : clientWidth > 767 , 'font-size-16' : clientWidth <= 767 }"   :style="{color : clientWidth > 767 ? '#535358' : '#3B3B3B' }">{{ option.name }}</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-else class="font-size-13 gray81 p-10px">No date found</div>
                                </div>
                                <div v-if="item.name.value === 'Task_Priority' && priorities.length" :class="{'width-211-px': clientWidth > 767, 'w-100' : clientWidth <= 767}">
                                    <div v-if="priorities.length">
                                        <label :for="'selectAll'+index" class="cursor-pointer d-flex align-items-center label-all">
                                            <div class="d-flex align-items-center check__component-wrapper">
                                                <CheckboxComponent :id="'selectAll'+index" v-model="item.isAllChecked" :value="item.isAllChecked" @click="allSelect(item)"/>
                                                <span  class="ml-5-px" :class="{'font-size-12 blue' : clientWidth > 767 , 'font-size-16' : clientWidth <= 767 }">Select All</span>
                                            </div>
                                            <!-- <img src="@/assets/images/svg/help_icon.svg" alt="" height="14" width="14" @click.stop.prevent=""/> -->
                                        </label>
                                        <div class="checkbox-dropdown-wrapper">
                                            <div v-for="(option, i) in priorities" :key="i" class="dropdown-item checkbox-dropdown" :class="{'border-radius-6-px' : clientWidth > 767 , 'border-radius-8-px' : clientWidth <= 767}">
                                                <label :for="'proority'+i" class="cursor-pointer d-flex align-items-center lebel-items font-size-14 GunPowder">
                                                    <CheckboxComponent :id="'proority'+i" :value="option.value" v-model="item.values" @change="handleChecked(item)" classes="filer-checkbox"/>
                                                    <img v-if="option.statusImage" :src="option.statusImage" alt="" height="10" width="10" :style="{ margin:  clientWidth > 767 ? '0px 5px' : '0px 8px 0 13px'}"/>
                                                    <span :class="{'ml-5-px': !option.statusImage, 'font-size-14' : clientWidth > 767 , 'font-size-16' : clientWidth <= 767}"
                                                        :style="{color : clientWidth > 767 ? '#535358' : '#3B3B3B' }"
                                                    >{{ option.name }}</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-else class="font-size-13 gray81 p-10px">No date found</div>
                                </div>
                                <div v-if="item.name.value === 'TaskTypeKey' && taskTypeArray.length" :class="{'width-211-px': clientWidth > 767, 'w-100' : clientWidth <= 767}">
                                    <div v-if="taskTypeArray.length">
                                        <label :for="'selectAll'+index" class="cursor-pointer d-flex align-items-center label-all">
                                            <div class="d-flex align-items-center check__component-wrapper">
                                                <CheckboxComponent :id="'selectAll'+index" v-model="item.isAllChecked" :value="item.isAllChecked" @click="allSelect(item)"/>
                                                <span  class="ml-5-px" :class="{'font-size-12 blue' : clientWidth > 767 , 'font-size-16' : clientWidth <= 767 }">Select All</span>
                                            </div>
                                            <!-- <img src="@/assets/images/svg/help_icon.svg" alt="" height="14" width="14" @click.stop.prevent=""/> -->
                                        </label>
                                        <div class="checkbox-dropdown-wrapper">
                                            <div v-for="(option, i) in taskTypeArray" :key="i" class="dropdown-item checkbox-dropdown" :class="{'border-radius-6-px' : clientWidth > 767 , 'border-radius-8-px' : clientWidth <= 767}">
                                                <label :for="'tasktype'+i" class="cursor-pointer d-flex align-items-center lebel-items font-size-14 GunPowder">
                                                    <CheckboxComponent :id="'tasktype'+i" :value="option.key" v-model="item.values" @change="handleChecked(item)"/>
                                                    <img class="task-type-image" v-if="option.taskImage" :src="option.taskImage" alt="" height="14" width="14" :style="{ margin:  clientWidth > 767 ? '0px 5px' : '0px 8px 0 13px'}" />
                                                    <span :class="{'ml-5-px': !option.taskImage, 'font-size-14' : clientWidth > 767 , 'font-size-16' : clientWidth <= 767}">{{ option.name }}</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-else class="font-size-13 gray81 p-10px">No date found</div>
                                </div>
                                <div v-if="item.name.value === 'Task_Leader' && users.length" :class="{'width-211-px': clientWidth > 767, 'w-100' : clientWidth <= 767}">
                                    <div v-if="users.length">
                                        <label :for="'selectAll'+index" class="cursor-pointer d-flex align-items-center label-all">
                                            <div class="d-flex align-items-center check__component-wrapper">
                                                <CheckboxComponent :id="'selectAll'+index" v-model="item.isAllChecked" :value="item.isAllChecked" @click="allSelect(item)"/>
                                                <span  class="ml-5-px" :class="{'font-size-12 blue' : clientWidth > 767 , 'font-size-16' : clientWidth <= 767 }">Select All</span>
                                            </div>
                                            <!-- <img src="@/assets/images/svg/help_icon.svg" alt="" height="14" width="14" @click.stop.prevent=""/> -->
                                        </label>
                                        <div class="checkbox-dropdown-wrapper">
                                            <div v-for="(option, i) in users" :key="i" class="dropdown-item checkbox-dropdown" :class="{'border-radius-6-px' : clientWidth > 767 , 'border-radius-8-px' : clientWidth <= 767}">
                                                <label :for="'createdby'+i" class="cursor-pointer d-flex align-items-center lebel-items font-size-14 GunPowder">
                                                    <CheckboxComponent :id="'createdby'+i" :value="option.value" v-model="item.values" @change="handleChecked(item)"/>
                                                    <!-- <img class="user-icon user__option-img" :src="option.image" alt="" /> -->
                                                    <WasabiIamgeCompp class="user-icon user__option-img" :data="{url: option.image}" :userImage="true" :thumbnail="'25x25'"/>
                                                    <span  :class="{'font-size-14' : clientWidth > 767 , 'font-size-16' : clientWidth <= 767 }"   :style="{color : clientWidth > 767 ? '#535358' : '#3B3B3B' }">{{ option.name }}</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-else class="font-size-13 gray81 p-10px">No date found</div>
                                </div>
                                <div v-if="item.name.value === 'tagsArray'" :class="{'width-250-px': clientWidth > 767, 'w-100' : clientWidth <= 767}">
                                    <div v-if="tagsArray.length"> 
                                        <label :for="'selectAll'+index" class="cursor-pointer d-flex align-items-center label-all">
                                            <div class="d-flex align-items-center check__component-wrapper">
                                                <CheckboxComponent :id="'selectAll'+index" v-model="item.isAllChecked" :value="item.isAllChecked" @click="allSelect(item)"/>
                                                <span  class="ml-5-px" :class="{'font-size-12 blue' : clientWidth > 767 , 'font-size-16' : clientWidth <= 767 }">Select All</span>
                                            </div>
                                            <!-- <img src="@/assets/images/svg/help_icon.svg" alt="" height="14" width="14" @click.stop.prevent=""/> -->
                                        </label>
                                        <div v-for="(option, i) in tagsArray" :key="i" class="dropdown-item checkbox-dropdown" :class="{'border-radius-6-px' : clientWidth > 767 , 'border-radius-8-px' : clientWidth <= 767}">
                                            <label :for="'tags'+i" class="cursor-pointer d-flex align-items-center lebel-items font-size-14">
                                                <CheckboxComponent :id="'tags'+i" :value="option.uid" v-model="item.values" @change="handleChecked(item)"/>
                                                <span class="ml-5-px border-radius-5-px p1px-15px text-ellipse tag_filter" :style="{'background-color': option.tagBgColor, 'color': option.tagColor}"
                                                :class="{'font-size-14' : clientWidth > 767 , 'font-size-16' : clientWidth <= 767 }" 
                                                >{{ option.name }}</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div v-else class="font-size-13 gray81 p-10px">No date found</div>
                                </div>
                            </div>
                        </template>
                    </CustomDropDown>
                    <CalenderCompo v-if="item?.name.value === 'DueDate'"
                        class="font-size-14 border-gray"
                        v-model:model-value="item.date"
                        :isShowDateAndicon="true"
                        :hideClearButton="true"
                        :style="{marginBottom : clientWidth <= 767 ? '20px !important' : '0' , padding : clientWidth <=767 ? '14.5px 10px' : '4.5px 12px 4.5px 8px' }"
                        :class= "{'width-250-px border-radius-4-px': clientWidth > 767, 'w-100 border-radius-8-px' : clientWidth <= 767 }"
                    />
                </div>
                <div class="cursor-pointer custom-filters-col" v-if="inputs.length > 1 && clientWidth > 767">
                    <img class="delete-icon ml-7px" src="@/assets/images/svg/filter_delete_svg.svg" alt="" @click="$emit('delete', { item, index })"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// Packages
import { defineProps, defineEmits, ref, inject } from 'vue';

// Component
import CalenderCompo from '@/components/atom/CalenderCompo/CalenderCompo.vue';
import CustomDropDown from '@/components/molecules/DropDown/CustomDropDown.vue';
import CheckboxComponent from '@/components/atom/Checkbox/CheckboxComponent.vue';
import WasabiIamgeCompp from "@/components/atom/WasabiIamgeCompp/WasabiIamgeCompp.vue";

// Emites
defineEmits(["delete"])

// IMAGES
const selectArrow = require('@/assets/images/svg/filter_select_dropdown.svg');
const selectArrowMobile = require('@/assets/images/svg/drop_down_mobile.svg');

// Props
const props = defineProps({
    inputs: {
        type: Array,
        default: () => []
    },
    mainOptions: {
        type: Array,
        default: () => []
    },
    statusArray: {
        type: Array,
        default: () => []
    },
    taskTypeArray: {
        type: Array,
        default: () => []
    },
    priorities: {
        type: Array,
        default: () => []
    },
    tagsArray: {
        type: Array,
        default: () => []
    },
    users: {
        type: Array,
        default: () => []
    }
});

// Variables
const clientWidth = inject("$clientWidth");
const arrayKeys = ref(["statusKey", "Task_Priority", "Task_Leader", "tagsArray", "TaskTypeKey"]);
const numberOfItem = ref(2);

// This function is used for toggle "And" and "Or" condition value for all the rows based on first condition
const setAllOptions = (item) => {
    props.inputs.forEach((x) =>  x.condition = item.condition);
}

// This is a callback function which is used to manage mulitple array based on type. It return data based on used
const manageArray = (type) => {
    let arrayData = [];

    if(type === "statusKey") {
        arrayData = props.statusArray;
    } else if (type === "Task_Priority") {
        arrayData = props.priorities;
    } else if (type === "TaskTypeKey") {
        arrayData = props.taskTypeArray;
    } else if (type === "Task_Leader") {
        arrayData = props.users;
    } else if (type === "tagsArray") {
        arrayData = props.tagsArray;
    }

    return arrayData;
}

// This function is used to checked or unchecked event for chackboxes based on data
const handleChecked = (item) => {
    let arrayData = manageArray(item.name.value);
    const result = arrayData.filter(i => item.values.includes(i.finalValue));
    item.displayData = result;
    item.isAllChecked = arrayData.length === item.values.length ? true : false;
}

// This function is used to all checked or unchecked event for chackboxes based on data
const allSelect = (item) => {

    item.isAllChecked = !item.isAllChecked;

    // Manage values array
    let arrayData = manageArray(item.name.value);
    if (item.isAllChecked) {
        item.values = arrayData.map(x => x.finalValue);
    } else {
        item.values = [];
    }

    // Manage display array
    const result = arrayData.filter(i => item.values.includes(i.finalValue));
    item.displayData = result;
}

// This function is used to reset all the sub fields in row on table based on parent option
const resetFields = (item) => {
    item.isAllChecked = false;
    item.values = [];
    item.displayData = [];
    item.comparison = {};
    item.date = "";
    const arraykeys = ["statusKey", "Task_Priority", "Task_Leader", "TaskTypeKey", "tagsArray"];
    const dateKeys = ["DueDate"];

    setTimeout(() => {
        if(arraykeys.includes(item.name.value)) {
            item.comparisonsData = [
                { value: ':', name: "Is" }
            ]
            item.comparison = { value: ':', name: "Is" };
        } else if(dateKeys.includes(item.name.value)) {
            item.comparisonsData = [
                { value: ':>', name: "Greater Than" },
                { value: ':<', name: "Less Than" },
                { value: ':=', name: "Equal To" }
            ]
            item.comparison = { value: ':>', name: "Greater Than" };
        }
    }, 200);
}

// This function is used to handel seleted options for the key and comparison field
const handleSelected = (field, item, option) => {
    if(field === 'comparison') {
        item.comparison = option;
    }
    if(field === 'keys') {
        item.name = option;
    }
}
</script>
<style scoped>
.up-downarrow{
   right: 9px; 
   top: 9px;
}
.select-compRef{
    max-width: 76%;
}
.task__leader-img{
    margin: 1px 5px 0 3px; 
    border-radius: 50%; 
    width: 25px; 
    height: 25px; 
    object-fit: cover;
}
.tags__array{
    padding: 2px 5px;
}
.select__arrow{
   right: 10px;
}
.check__component-wrapper{
    line-height:12px;
}
.user__option-img{
    border-radius: 50%; 
    margin: 0px 5px; 
    width:25px; 
    height: 25px;
}
.tag_filter {
    max-width: 165px;
}
</style>