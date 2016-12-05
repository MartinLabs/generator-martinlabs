<template>

    <th @click="store.setOrder(name)">
        <slot></slot>
        <span :class="{ glyphicon: store.orderBy === name, 'glyphicon-chevron-up': store.orderBy === name && store.asc, 'glyphicon-chevron-down': store.orderBy === name && !store.asc }"></span>
    </th>

</template>

<script>
export default {
    name: "adap-th",
    props: ["store", "name"],
}
</script>

