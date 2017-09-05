<template>

    <div class="form-group" :class="{ required: required != null }">
        <label :for="`input-group${_uid}`" class="control-label">
            {{ label }}
            <slot></slot>
        </label>

        <!--
        I HAD TO MAKE 5 REPEATED INPUTS WITH V-IF TO CHANGE THE THINGS THAT CAN'T BE DYNAMIC
        -->

        <input :id="`input-group${_uid}`"
               v-if="['text', 'email', 'password', 'number'].indexOf(type) == -1"
               type="text"
               :maxlength="maxlength"
               :required="required != null"
               :step="step"
               :placeholder="placeholder"
               v-mask="mask"
               v-model.lazy="computedModel"
               class="form-control"/>

        <input :id="`input-group${_uid}`"
               v-if="type == 'text'"
               type="text"
               :maxlength="maxlength"
               :required="required != null"
               :step="step"
               :placeholder="placeholder"
               v-model="computedModel"
               class="form-control"/>

        <input :id="`input-group${_uid}`"
               v-if="type == 'email'"
               type="email"
               :maxlength="maxlength"
               :required="required != null"
               :step="step"
               :placeholder="placeholder"
               v-model="computedModel"
               class="form-control"/>

        <input :id="`input-group${_uid}`"
               v-if="type == 'password'"
               type="password"
               :maxlength="maxlength"
               :required="required != null"
               :step="step"
               :placeholder="placeholder"
               v-model="computedModel"
               class="form-control"/>

        <input :id="`input-group${_uid}`"
               v-if="type == 'number'"
               type="number"
               :maxlength="maxlength"
               :required="required != null"
               :step="step"
               :placeholder="placeholder"
               v-model.number="computedModel"
               class="form-control"/>
    </div>

</template>
<script>
  import InputGroupMixin from './InputGroupMixin';

  export default {
    name: 'InputGroup',
    mixins: [InputGroupMixin],
  };
</script>