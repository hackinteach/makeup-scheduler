<template>
  <v-container class="my-div">
    <v-container text-xs-center class="my-container" grid-list-xs>
      <v-layout row wrap class="my-layout">
        <!-- DATE ROW -->
        <v-flex xs12 class="my-flex">
          <v-layout>
            <v-flex xs12 class="my-flex">
              <v-card dark color="primary">
                <v-card-text class="px-0">Date</v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12 v-for="day in days" :key="day.id" class="my-flex">
              <v-card dark color="primary">
                <v-card-text class="px-0">{{ day.date }}</v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-flex>
        <!-- Time slots -->
        <v-flex xs12 v-for="(row,i) in table" :key="i">
          <v-layout>
            <v-flex xs12 class="my-flex">
              <v-card flat>
                <v-card-text class="px-0">{{timeslots[i]}}~</v-card-text>
              </v-card>
            </v-flex>
            <v-flex
              xs12 v-for="(cell,j) in row" :key="j" class="my-flex"
              @click="toggle(i,j)">
              <v-card tile flat v-if="cell"
                      class="green">
                <v-card-media height="20px">
                </v-card-media>
                <v-card-text
                  class="px-0"></v-card-text>
              </v-card>
              <v-card tile flat v-if="!cell"
                      class="white">
                <v-card-media height="20px">
                </v-card-media>
                <v-card-text
                  class="px-0"></v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
  </v-container>
</template>

<script>
  import {db, auth} from '../firebase';

  export default {
    beforeMount() {
      this.newDate();
    },
    data() {
      return {
        days: [],
        table: [
          [false, false, false, false, false, false, false],
          [false, false, false, false, false, false, false],
          [false, false, false, false, false, false, false],
          [false, false, false, false, false, false, false],
          [false, false, false, false, false, false, false],
          [false, false, false, false, false, false, false],
          [false, false, false, false, false, false, false],
          [false, false, false, false, false, false, false],
          [false, false, false, false, false, false, false],
          [false, false, false, false, false, false, false],
          [false, false, false, false, false, false, false],
          [false, false, false, false, false, false, false],
          [false, false, false, false, false, false, false],
        ],
        timeslots: ["8.00", "9.00", '10.00', '11.00', '12.00',
          '13.00', '14.00', '15.00', '16.00', '17.00', '18.00', '19.00', '20.00'],

      }
    },
    watch:{
      table(){

      }
    },
    methods: {
      toggle(i,j){
        console.log(`${i} ${j} clicked`);
        console.log(`before ${this.table[i][j]}`);
        this.table[i][j] = !this.table[i][j];
        console.log(`after ${this.table[i][j]}`);
      },

      newDate() {
        /* If start date is null*/

        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1; //January is 0!
        let yyyy = today.getFullYear();

        if (dd < 10) {
          dd = '0' + dd
        }

        if (mm < 10) {
          mm = '0' + mm
        }

        let startDate = `${mm}/${dd}/${yyyy}`


        let dateSplit = startDate.split("/")
        let month = parseInt(dateSplit[1])
        let year = parseInt(dateSplit[2])
        let day = parseInt(dateSplit[0])
        let nextDay;
        let lst = [{
          'id': 1, 'date': day + "/" + month + "/" + year
        }];
        let i;
        for (i = 1; i < 7; i++) {
          nextDay = this.getNextDate(year, month, day)
          year = nextDay[0]
          month = nextDay[1]
          day = nextDay[2]
          lst.push({'id': i + 1, 'date': day + "/" + month + "/" + year})
        }
        // console.log(lst);
        this.days = lst;
      },

      getNextDate(year, month, day) {
        if (month === 12 && day === 31) {
          return [year + 1, 1, 1]
        }
        else if (day === 28 && month === 2) {
          return [year, 3, 1]
        }
        else if (day === 30 && (month === 4 || month === 6 || month === 9 || month === 11)) {
          return [year, month + 1, 1]
        }
        else if (day === 31) {
          return [year, month + 1, 1]
        }
        else {
          return [year, month, day + 1]
        }
      },

      async generateDate() {
        const code = this.$route.params.id;
        const dbRefs = db.ref("/session/" + code);
        let startDate;
        dbRefs.once('value').then(
          snapshot => {
            const sId = snapshot.val();
            // console.log('sId',sId)
            Object.keys(sId).map(id => {
              if (id !== "users") {
                // console.log('id',id);
                const session = sId[id];
                // console.log(session.startDate);
                startDate = session.startDate;
                /* If start date is null*/
                if (startDate) {
                  let today = new Date();
                  let dd = today.getDate();
                  let mm = today.getMonth() + 1; //January is 0!
                  let yyyy = today.getFullYear();

                  if (dd < 10) {
                    dd = '0' + dd
                  }

                  if (mm < 10) {
                    mm = '0' + mm
                  }

                  startDate = `${mm}/${dd}/${yyyy}`
                }

                let dateSplit = startDate.split("/")
                let month = parseInt(dateSplit[1])
                let year = parseInt(dateSplit[2])
                let day = parseInt(dateSplit[0])
                let nextDay;
                let lst = [{
                  'id': 1, 'date': day + "/" + month + "/" + year
                }];
                let i;
                for (i = 1; i < 7; i++) {
                  nextDay = this.getNextDate(year, month, day)
                  year = nextDay[0]
                  month = nextDay[1]
                  day = nextDay[2]
                  lst.push({'id': i + 1, 'date': day + "/" + month + "/" + year})
                }
                // console.log(lst);
                this.days = lst;
              }
            })
          }
        )
      },
    }
  }
</script>

<style scoped>
  .green {
    color: #008000;
    padding: 0;
  }

  .white {
    color: white;
    padding: 0;
  }

  .my-flex {
    padding: 0;
  }

  .my-layout {
    padding: 1.5em;
  }

  .my-container {
    background-color: rgba(0, 0, 0, 0.3);
    margin-top: 2em;
    margin-bottom: 2em;
    padding: 2em;
  }

  [draggable] {
    -moz-user-select: none;
    -webkit-user-select: none;
    user-select: none;
    /* Required to make elements draggable in old WebKit */
    -webkit-user-drag: element;
    cursor: move;
  }

  .my-div {
    background-image: url('../assets/bg/3.jpg');
    background-size: cover;
    min-width: 100%;
    min-height: 100%;
    background-position-x: left;
  }
</style>
