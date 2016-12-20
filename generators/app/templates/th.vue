<template>

    <th @click="store.setOrder(name)" :class="{ 'dropup': !store.asc }">
        <slot></slot>
        <span :class="{ 'caret': store.orderBy === name }"></span>
    </th>

</template>

<script>
export default {
    name: "adap-th",
    props: ["store", "name"]
}
</script>

