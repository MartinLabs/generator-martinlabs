<template>

    <input type="text" class="form-control" v-model="store.query" @keyup="store.searchByQuery()">
    </input>

</template>

<script>
export default {
    name: "adap-searchfield",
    props: ["store"]
}
</script>

