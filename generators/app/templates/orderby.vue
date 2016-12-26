<template>

    <div @click="store.setOrder(name)" style="cursor:pointer" :class="{ 'dropup': !store.asc }">
        <slot></slot>
        <span :class="{ 'caret': store.orderBy === name }"></span>
    </div>

</template>

<script>
export default {
    name: "adap-orderby",
    props: ["store", "name"]
}
</script>