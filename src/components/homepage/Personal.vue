<template>
  <v-container class="my-div">
    <v-container text-xs-center class="my-container" grid-list-xs>
      <v-flex xs6 :style="{backgroundColor: 'rgba(255,255,255,0.7)',minWidth: '100%',padding: '1em'}">
        <v-subheader>Choose Session Type</v-subheader>
        <v-select
          :items="types"
          v-model="type"
          label="Table view"
          single-line
        ></v-select>
      </v-flex>
      <v-layout row wrap>
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
        <v-flex xs12 v-for="timeslot in timeslots" :key="timeslot.id">
          <v-layout>
            <v-flex xs12 class="my-flex">
              <v-card flat>
                <v-card-text class="px-0">{{ timeslot.start }}~</v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12 v-for="day in days" :key="day.id"
                    v-on:click="type === 'personal' ? getSlotId(day, timeslot) : ()=>{}">
              <v-card tile flat
                      v-bind:class="[findIsClicked(day, timeslot) >= 0 ? 'green' : 'my-flex']">
                <v-card-media height="20px">
                </v-card-media>
                <v-card-text class="px-0"></v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs12 text-xs-center :style="{backgroundColor: 'rgba(255,255,255,0.7)',minWidth: '100%',padding: '1em'}">
          <v-btn raised color="primary" :disabled="type==='session'" @click.stop="confirmSubmit=true">submit</v-btn>
          <v-btn raised color="secondary" @click="logout">logout</v-btn>
          <!--<v-btn raised @click="consoleOut">Log</v-btn>-->
          <InfoDialog/>
        </v-flex>
        <!--Confirm Dialog-->
        <v-dialog v-model="confirmSubmit" max-width="500px">
          <v-card>
            <v-card-title>
              <span>Confirm change</span>
            </v-card-title>
            <v-card-actions>
              <v-btn color="primary" flat @click="save">Save</v-btn>
              <v-btn color="secondary" flat @click="confirmSubmit=false">Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>
    </v-container>
  </v-container>
</template>

<script>
  import {auth, db} from '../../firebase';
  import * as _ from 'lodash';
  import InfoDialog from '../InfoDialog';

  export default {
    components: {InfoDialog},
    beforeMount() {
      this.generateDate();
      /* Initialize personal table*/
      const code = this.$route.params.id;
      const dbRefs = db.ref("/session/" + code + "/users/");
      // console.log(auth.currentUser);
      auth.onAuthStateChanged(user => {
        if (user) {
          const uid = auth.currentUser.uid;
          // console.log('uid', uid);
          dbRefs.once("value").then((snapshot) => {
              // console.log(snapshot.val());
              const uu = snapshot.val();
              // console.log('uu', uu[uid]);
              const use = uu[uid];
              if (!use) {
                this.clicked = [{"dayId": 0, "timeId": 0}];
              } else {
                this.clicked = uu[uid];
              }
              // console.log("clicked in created", this.clicked)
            }
          )
        } else {
          this.clicked = [{"dayId": 0, "timeId": 0}];
        }
      })


      /* Listener fo real time session table */
      dbRefs.on("child_changed", (snapshot) => {
        const users = snapshot.val();
        // console.log('data changed',users);
        if (this.type === 'session') {
          let u;
          let tt = [];
          for (u in users) {
            console.log('u in user', users[u]);
            const userTime = users[u];
            tt.push(userTime)
          }
          tt = _.uniqWith(tt, _.isEqual);
          this.toUpdate = tt;
          // this.clicked.concat(tt);

          // console.log(this.clicked);
          // console.log(tt);
        }
      })
    },
    data() {
      return {
        types: [
          "personal", "session"
        ],
        type: 'personal',
        confirmSubmit: false,
        timetable: [],
        sessionCode: this.$route.params.id,
        newLessonName: '',
        newLessonDay: 0,
        newLessonTimeslot: 0,
        days: [],
        timeslots: [
          {
            'id': 1,
            'start': '08:00',
            'end': '09:00'
          },
          {
            'id': 2,
            'start': '09:00',
            'end': '10:00'
          },
          {
            'id': 3,
            'start': '10:00',
            'end': '11:00'
          },
          {
            'id': 4,
            'start': '11:00',
            'end': '12:00'
          },
          {
            'id': 5,
            'start': '12:00',
            'end': '13:00'
          },
          {
            'id': 6,
            'start': '13:00',
            'end': '14:00'
          },
          {
            'id': 7,
            'start': '14:00',
            'end': '15:00'
          },
          {
            'id': 8,
            'start': '15:00',
            'end': '16:00'
          },
          {
            'id': 9,
            'start': '16:00',
            'end': '17:00'
          },
          {
            'id': 10,
            'start': '17:00',
            'end': '18:00'
          },
          {
            'id': 11,
            'start': '18:00',
            'end': '19:00'
          },
          {
            'id': 12,
            'start': '19:00',
            'end': '20:00'
          }
        ],
        clicked: [{"dayId": 0, "timeId": 0}],
        toUpdate: [],
      }
    },
    watch: {
      type() {
        const code = this.$route.params.id;
        const dbRefs = db.ref("/session/" + code + "/users");
        if (this.type === "personal") {
          let uid = auth.currentUser.uid;
          // console.log(dbRefs);
          dbRefs.once("value").then((snapshot) => {
            // console.log(snapshot.val()[uid]);
            const uu = snapshot.val()[uid];
            this.clicked = uu;
            // console.log("personal clicked at watch", this.clicked)
          }, function (errorObject) {
            alert("The read failed: " + errorObject.code);
          });
        } else if (this.type === "session") {
          dbRefs.once("value").then(snapshot => {
            const users = snapshot.val();
            let u;
            let tt = [];
            for (u in users) {
              const userTime = users[u];
              Object.values(userTime).map(t => {
                tt.push(t)
              })
            }
            this.clicked = _.uniqWith(tt, _.isEqual)
          })
        }
      }
    },
    methods: {
      consoleOut() {
        console.log(this.clicked);
      },
      logout() {
        auth.logout()
          .then(() => this.$router.push('/'));
      },
      save() {
        this.confirmSubmit = false;
        const code = this.$route.params.id;
        const uid = auth.currentUser.uid;
        const dbRefs = db.ref(`session/${code}/users/`);
        dbRefs.update({[uid]: this.clicked});
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
                let startDate = session.startDate;
                if (startDate === null) {
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

      findIsClicked(day, timeslot) {
        let i;
        if (this.clicked === null) {
          return -1;
        }
        if (this.clicked.length === 0) {
          return -1;
        }
        for (i = 0; i < this.clicked.length; i++) {
          // console.log(slot)
          if (this.clicked[i]['dayId'] === day.id && this.clicked[i]['timeId'] === timeslot.id) {
            // console.log("true")
            // console.log(this.clicked[i]['dayId'])
            return i;
          }
        }
        return -1;
      },

      getSlotId(day, timeslot) {
        // console.log(this.clicked)
        // console.log(day.id+"-> "+timeslot.id)
        const idx = this.findIsClicked(day, timeslot)
        // console.log("onclicked", this.clicked)
        if (idx >= 0) {
          this.clicked.splice(idx, 1)
        }
        else {
          this.clicked.push({'dayId': day.id, 'timeId': timeslot.id})
        }
      }
    }
  }
</script>

<style scoped>
  green {
    color: #008000;
    padding: 0px
  }

  my-flex {
    padding: 0px
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

  .my-div{
    background-image: url('../../assets/bg/3.jpg');
    background-size: cover;
    min-width: 100%;
    min-height:100%;
    background-position-x: left;
  }

</style>
