<script>
  import { Line } from 'vue-chartjs';
  import moment from 'moment';

  export default Line.extend({
    name: 'line-chart',
    props: ['list', 'colXName', 'colYName'],
    data() {
      return {
        opts: {
          legend: {
            display: false,
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
                  year: this.$lang.dateFormat.date,
                },
              },
            }],
          },
          tooltips: {
            callbacks: {
              title(tooltip) {
                return moment(tooltip[0].xLabel).format(this.$lang.dateFormat.datetime);
              },
            },
          },
        },
      };
    },
    watch: {
      list() {
        this.selfRender();
      },
    },
    mounted() {
      this.selfRender();
    },
    methods: {
      selfRender() {
        this.renderChart({
          datasets: [{
            data: this.prepareData(),
            fill: false,
          }],
        }, this.opts);
      },
      prepareData() {
        const dataSet = this.list.map(i => ({
          x: this.list[i][this.colXName],
          y: this.list[i][this.colYName],
        }));

        dataSet.sort((a, b) => {
          if (a.x < b.x) {
            return -1;
          } else if (a.x > b.x) {
            return 1;
          }
          return 0;
        });

        return dataSet;
      },
    },
  });

</script>