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
        name: "MultiselectGroup",
        props: ["value", "label", "items", "propname"],
        data() {
            return  {};
        },
        computed: {
            computedModel: {
                get() {
                    var values = [];
                    for (let item of this.value) {
                        values.push(item[this.propname]);
                    }
                    return values;
                },
                set(val) {
                    var values = [];
                    for (let item of val) {
                        var obj = {};
                        obj[this.propname] = item;
                        values.push(obj);
                    }
                    this.updateValue(values);
                }
            }
        },
        methods: {
            updateValue(val) {
                this.$emit('input', val);
            }
        }
    }

</script>


