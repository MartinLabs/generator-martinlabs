<script>
    import { Line } from 'vue-chartjs';
    import moment from 'moment';
    import AppTranslator  from '../../service/AppTranslator';

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
                                        "millisecond": AppTranslator.data.dateFormat.date,
                                        "second": AppTranslator.data.dateFormat.date,
                                        "minute": AppTranslator.data.dateFormat.date,
                                        "hour": AppTranslator.data.dateFormat.date,
                                        "day": AppTranslator.data.dateFormat.date,
                                        "week": AppTranslator.data.dateFormat.date,
                                        "month": AppTranslator.data.dateFormat.date,
                                        "quarter": AppTranslator.data.dateFormat.date,
                                        "year": AppTranslator.data.dateFormat.date
                                    }
                                }
                            }]
                    },
                    tooltips: {
                        callbacks: {
                            title: function (tooltip, data) {
                                return moment(tooltip[0].xLabel).format(AppTranslator.data.dateFormat.datetime);
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