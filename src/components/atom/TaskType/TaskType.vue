<template>
    <div :id="tourId">
        <DropDown :id="id">
            <template #button>
                <div :ref="id" :style="{'margin-left' : isBoardView ? `0px` : `20px`}" class="task__type-width">
                    <slot name="head">
                        <img v-if="modelValue?.taskImage?.includes('http')" :src="modelValue?.taskImage" alt="task_type"  class="position-re vertical-middle task__image">
                        <WasabiImage
                            v-else
                            class="position-re vertical-middle task__image"
                            :data="{url: modelValue?.taskImage}"
                        />
                    </slot>
                </div>
            </template>

            <template #options>
                <DropDownOption v-for="(item, typeIndex) in options" :key="typeIndex" @click="$emit('update:modelValue', item), $emit('select', item,convertTaskType), $refs[id].click()">
                    <div class="d-flex align-items-center">
                        <img v-if="item?.taskImage?.includes('http')" :src="item?.taskImage" alt="task_type" :title="taskType?.name" class="task__type-image vertical-middle ml-6px">
                        <WasabiImage 
                            v-else
                            class="task__type-image vertical-middle ml-6px"
                            :data="{url: item?.taskImage}"
                        />
                        <span class="ml-5px" >{{item.name}}</span>
                    </div>
                </DropDownOption>
            </template>
        </DropDown>
    </div>
</template>

<script setup>
// PACKAGES
import {defineProps, defineEmits} from 'vue';

// COMPONENTS
import DropDown from '@/components/molecules/DropDown/DropDown.vue';
import DropDownOption from '@/components/molecules/DropDownOption/DropDownOption.vue';
import WasabiImage from "@/components/atom/WasabiIamgeCompp/WasabiIamgeCompp.vue";

defineProps({
    id: {
        type: String,
        required: true
    },
    modelValue: {
        type: Object,
        required: true
    },
    options: {
        type: Array,
        required: true,
    },
    convertTaskType: {
        type: Object,
        default: () => ({})
    },
    isBoardView: {
        type: Boolean,
        default: false
    },
    tourId: {
        type: String,
        default: ''
    }
})

defineEmits(['update:modelValue', 'select'])
</script>

<style scoped>
.task__type-width{
    height:13px; 
    width:13px;
}
.task__image{
    height:13px; 
    width:15px; 
    object-fit: contain;
    top: -2px;
}
.task__type-image{
    height:13px; 
    width:13px;
    object-fit: contain;                  
}
</style>