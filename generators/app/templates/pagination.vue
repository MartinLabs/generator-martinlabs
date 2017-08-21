<template>

  <ul class="pagination">
    <li><a @click="prev">&laquo;</a></li>

    <li :class="current === first ? 'active' : ''">
      <a @click="goto(first)">{{first}}</a>
    </li>

    <li v-if="current > first + gap + 1"><a>...</a></li>

    <li v-for="n in gap*2 + 1" v-if="index(n) > first && index(n) < last" :class="current === index(n) ? 'active' : ''">
      <a @click="goto(index(n))">{{ index(n) }}</a>
    </li>

    <li v-if="current < last - gap - 1"><a>...</a></li>

    <li :class="current === last ? 'active' : ''" v-if="last !== 1">
      <a @click="goto(last)">{{last}}</a>
    </li>

    <li><a @click="next">&raquo;</a></li>
  </ul>

</template>

<script>
  export default {
    name: 'adap-pagination',
    props: {
      store: Object,
      pageSize: Number,
      gap: {
        type: Number,
        default: 2
      }
    },
    computed: {
      first () {
        return 1
      },
      current () {
        return this.store.currentPage + 1
      },
      last () {
        return this.store.pageCount + 1
      }
    },
    mounted () {
      if (this.pageSize) {
        this.store.setPageSize(this.pageSize)
      }
    },
    methods: {
      goto (n) {
        this.store.setCurrentPage(n - 1)
      },

      next () {
        this.store.nextPage()
      },

      prev () {
        this.store.previousPage()
      },

      index (n) {
        var pos = this.current

        if (this.current < 1 + this.gap) pos = 1 + this.gap
        else if (this.current > this.last - this.gap) pos = this.last - this.gap

        return n + pos - this.gap - 1
      }

    }
  }
</script>

