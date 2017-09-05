<template>

    <div class="form-group">
        <div class="checkbox">
            <label>
                <input type="checkbox"
                       v-model="computedModel">
                {{ label }}
                <slot></slot>
            </label>
        </div>
    </div>

</template>
<script>
  export default {
    name: 'CheckboxGroup',
    props: ['value', 'label'],
    data() {
      return {};
    },
    computed: {
      computedModel: {
        get() {
          return this.value;
        },
        set(val) {
          this.updateValue(val);
        },
      },
    },
    methods: {
      updateValue(val) {
        this.$emit('input', val);
      },
    },
  };
</script>

