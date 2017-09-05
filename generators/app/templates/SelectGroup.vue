<template>

    <div class="form-group" :class="{ required: required != null }">
        <label :for="`select-group${_uid}`" class="control-label">
            {{ label }}
            <slot name="label"></slot>
        </label>

        <select :id="`input-group${_uid}`"
                :required="required != null"
                v-model="computedModel"
                class="form-control" >
            <slot></slot>
        </select>
    </div>

</template>
<script>
  export default {
    name: 'SelectGroup',
    props: ['value', 'required', 'label'],
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
