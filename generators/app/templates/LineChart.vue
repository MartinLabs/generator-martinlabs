<script>
    import { Line } from 'vue-chartjs';
    import moment from 'moment';

    export default Line.extend({
        name: "line-chart",
        props: ["list", "colXName", "colYName"],
        data() {
            return {
                opts: {
                    legend: {
                        display: false
                    },
                    scales: {
                        xAxes: [{
                                type: 'time',
                                time: {
                                    displayFormats: {
                                        millisecond: this.$lang.dateFormat.date,
                                        second: this.$lang.dateFormat.date,
                                        minute: this.$lang.dateFormat.date,
                                        hour: this.$lang.dateFormat.date,
                                        day: this.$lang.dateFormat.date,
                                        week: this.$lang.dateFormat.date,
                                        month: this.$lang.dateFormat.date,
                                        quarter: this.$lang.dateFormat.date,
                                        year: this.$lang.dateFormat.date
                                    }
                                }
                            }]
                    },
                    tooltips: {
                        callbacks: {
                            title: function (tooltip, data) {
                                return moment(tooltip[0].xLabel).format(this.$lang.dateFormat.datetime);
                            }
                        }
                    }
                }
            }
        },
        watch: {
            list() {
                this.selfRender();
            }
        },
        mounted() {
            this.selfRender();
        },
        methods: {
            selfRender() {
                this.renderChart({
                    datasets: [{
                        data: this.prepareData(),
                        fill: false
                    }]
                }, this.opts);
            },
            prepareData() {
                var dataSet = [];

                for (var i in this.list) {
                    var obj = this.list[i];

                    dataSet.push({
                        x: obj[this.colXName],
                        y: obj[this.colYName]
                    });
                }

                dataSet.sort(function (a, b) {
                    if (a.x < b.x) {
                        return -1;
                    } else if (a.x > b.x) {
                        return 1;
                    } else {
                        return 0;
                    }
                });

                return dataSet;

            }
        }
    });
</script>