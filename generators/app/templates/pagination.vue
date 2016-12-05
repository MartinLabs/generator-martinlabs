<template>

    <ul class="pagination">
        <li><a @click="store.previousPage()">&laquo;</a></li>
        <li v-for="n in store.pageCount+1" 
            :class="{ active: n == store.currentPage+1 }"
            @click="store.setCurrentPage(n-1)">
            <a>{{ n }}</a>
        </li>
        <li><a @click="store.nextPage()">&raquo;</a></li>
    </ul>

</template>

<script>
export default {
    name: "adap-pagination",
    props: ["store", "pageSize"],
    mounted: function() {
        if (this.pageSize) {
            this.store.setPageSize(this.pageSize);
        }
    }
}
</script>

