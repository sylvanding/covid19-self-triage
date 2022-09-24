<template>
  <div id="clock">
    <p class="date">{{ date }}</p>
    <p class="time">{{ time }}</p>
  </div>
</template>

<script>
export default {
  name: 'Statistics',
  data() {
    return {
      cd: null,
      time: '',
      date: '',
      week: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    }
  },
  mounted() {
    this.loadData()
    this.formatDate()
    this.run()
  },
  methods: {
    run() {
      setInterval(this.updateTime, 1000)
    },
    loadData() {
      this.cd = new Date()
    },
    updateTime() {
      this.cd.setSeconds(this.cd.getSeconds() + 1)
      this.formatDate()
    },
    formatDate() {
      this.time =
        this.zeroPadding(this.cd.getHours(), 2) +
        ':' +
        this.zeroPadding(this.cd.getMinutes(), 2) +
        ':' +
        this.zeroPadding(this.cd.getSeconds(), 2)
      this.date =
        this.zeroPadding(this.cd.getFullYear(), 4) +
        '-' +
        this.zeroPadding(this.cd.getMonth() + 1, 2) +
        '-' +
        this.zeroPadding(this.cd.getDate(), 2) +
        ' ' +
        this.week[this.cd.getDay()]
    },
    zeroPadding(num, digit) {
      let zero = ''
      for (let i = 0; i < digit; i++) {
        zero += '0'
      }
      return (zero + num).slice(-digit)
    },
  },
}
</script>

<style lang="less">
#clock {
  p {
    margin: 0;
    padding: 0;
  }
  text-align: center;
  .time {
    letter-spacing: 0.05em;
    font-size: medium;
    padding: 5px 0;
  }
  .date {
    letter-spacing: 0.1em;
    font-size: small;
  }
}
</style>
