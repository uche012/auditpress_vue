<template>
    <div class="audiowasabi_comp">
        <audio :id="`audioattachment_${props.audioSrc.id}`" :src="imageUrl" controls @play="pauseOthers(props.audioSrc.type, `audioattachment_${props.audioSrc.id}`)" @pause="(e) => {e.preventDefault()}"></audio>
    </div>
</template>

<script setup>
import {defineProps,inject,onMounted,ref} from 'vue';
import * as env from '@/config/env';
import { apiRequest } from '../../../services';
const companyId = inject('$companyId');
const isFetching = ref(false);
const imageUrl = ref('');
const props = defineProps({
    audioSrc:{
        type:Object,
        default:()=>{}
    },
})
onMounted(()=>{
    getWasabiAudioFile(props.audioSrc.attached)
})
function getWasabiAudioFile(path) {
    isFetching.value = true;
    const formData = {
        companyId: companyId.value,
        path: path
    }
    apiRequest("post", env.WASABI_RETRIVE_OBJECT, formData).then((response)=>{
        if(response.data.status === true){
            imageUrl.value = response.data.statusText
            isFetching.value = false;
        }
    }).catch((err)=>{
        console.error(err,"error in get image data");
    })
}
function pauseOthers(type = 'audio', id) {
    let items = Array.from(document.getElementsByTagName(`${type}`))

    items.forEach((item) => {
        if(!item.id || item.id !== id) {
            item.pause();
        } else {
            item.play();
        }
    })
}
</script>
<style>
.audiowasabi_comp audio{
    max-height: 100%;
    max-width: 100%;
    margin: auto;
    object-fit: contain;
    height: 40px !important;
}
@media(max-width: 767px){
    .audiowasabi_comp audio{width: 715px !important;}
}
</style>