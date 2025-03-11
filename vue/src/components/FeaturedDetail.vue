<template>
    <div>
        <h1>{{ featuredWork.title }}</h1>
        <img :src="featuredWork.image" :alt="featuredWork.title" />
        test
    </div>
</template>

<script>


export default {
    props: ['featuredWork']
}
</script>

<style>
    
</style>