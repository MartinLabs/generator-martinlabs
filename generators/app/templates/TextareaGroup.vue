<template>

    <div class="form-group" :class="{ required: required != null }">
        <label :for="`textarea-group${_uid}`"
               class="control-label">
            {{ label }}
            <slot></slot>
        </label>
        <textarea :id="`textarea-group${_uid}`"
                  v-model="computedModel"
                  class="form-control"
                  :rows="rows"
                  :required="required != null"></textarea>
    </div>

</template>
<script>
  export default {
    name: 'TextareaGroup',
    props: ['value', 'label', 'required', 'rows'],
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