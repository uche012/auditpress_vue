<template>
    <div class="d-flex cursor-pointer align-items-center custom_field_wrapper border-radius-7-px m-20px" :style="[{'border':`1.5px solid ${props.cfPrimaryColor}`}]">
        <div class="custom_field__wrapper-image">
            <img :src="props.cfIcon" :alt="props.cfTitle"> 
        </div>
        <div class="custom_field__wrapper-tittle">
            <h5 class="font-roboto-sans font-size-14 font-weight-500 line-height-22px">{{props.cfTitle}}</h5>
            <span class="font-roboto-sans font-size-13 font-weight-400 gray">{{props.cfDescrption}}</span>
        </div>
    </div>
</template>

<script setup>
    const props = defineProps({
        cfIcon:{
            type:String,
            default:""
        },
        cfDescrption:{
            type:String,
            default:""
        },
        cfTitle:{
            type:String,
            default:""
        },
        cfPrimaryColor:{
            type:String,
            default:""
        }
    })
</script>
<style scoped>
    @import '@/components/atom/CustomFieldComponentStructure/style.css';
</style>