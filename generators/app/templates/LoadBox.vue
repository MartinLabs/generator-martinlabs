<template>
    <span>
        <slot v-if="showContent"/>
        <slot name="loading" v-if="showLoading"/>
        <slot name="error" v-if="showError"/>
    </span>
</template>

<script>
  import debounce from 'debounce-promise'

  export default {
    name: 'LoadBox',
    props: {
      resource: Function,
      params: Object,
      value: {},
      container: String,
      debounce: Number,
      validParams: {type: Boolean, default: true},
      alwaysShowContent: Boolean,
      showContentOnLoading: Boolean,
      showContentOnError: Boolean,
      manual: Boolean
    },
    data () {
      return {
        error: null,
        loading: null
      }
    },
    mounted () {
      if (this.debounce) {
        this.debouncedResource = debounce(this.resource, this.debounce)
      }

      if (!this.manual) {
        this.load()
      }
    },
    computed: {
      showLoading () {
        return this.loading
      },
      showError () {
        return this.error
      },
      showContent () {
        return this.alwaysShowContent || (
            this.value && (this.showContentOnLoading || !this.loading) && (this.showContentOnError || !this.error))
      }
    },
    watch: {
      params: {
        deep: true,
        handler (newV, oldV) {
          if (!this.manual && JSON.stringify(newV) !== JSON.stringify(oldV)) {
            this.load()
          }
        }
      }
    },
    methods: {

      load () {
        if (!this.validParams) {
          this.$emit('onInvalidParams')
          return
        }

        this.loading = true
        this.$emit('onLoading')

        var actualRes = this.resource
        if (this.debounce) {
          actualRes = this.debouncedResource
        }

        actualRes(this.params).then(function (resp) {
          this.loading = false
          this.error = null
          this.$emit('onDone')

          if (this.container) {
            for (var cont of this.container.split('.')) {
              resp = resp[cont]
            }
          }

          this.$emit('input', resp)
          this.$emit('onSuccess')
        }.bind(this)).catch(function (error) {
          this.loading = false
          this.$emit('onDone')

          this.error = error
          this.$emit('onError', error)
        }.bind(this))
      }
    }
  }

</script>
