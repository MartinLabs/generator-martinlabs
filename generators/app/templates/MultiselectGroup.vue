<template>

    <div class="form-group">
        <label class="multiselect-label">
            {{ label }}
            <slot name="label"></slot>
        </label>
        <div>
            <div v-for="item in items" class="checkbox">
                <label>
                    <input type="checkbox" :value="item[propname]" v-model="computedModel">
                    <slot name="item" :item="item"></slot>
                </label>
            </div>
        </div>
    </div>

</template>
<script>
  export default {
    name: 'MultiselectGroup',
    props: ['value', 'label', 'items', 'propname'],
    data() {
      return {};
    },
    computed: {
      computedModel: {
        get() {
          return this.value.map(item => item[this.propname]);
        },
        set(val) {
          this.updateValue(val.map(item => ({ [this.propname]: item })));
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


