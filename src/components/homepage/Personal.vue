<template>
  <div>
    <v-container text-xs-center>
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
              <!--<v-flex xs12 v-for="timeslot in timeslots" :key="timeslot.id">-->
              <!--<v-card>-->
              <!--<v-card-text class="px-0">{{ timeslot.start }}~</v-card-text>-->
              <!--</v-card>-->
            </v-flex>
          </v-layout>

        </v-flex>


        <v-flex xs12 v-for="timeslot in timeslots" :key="timeslot.id">
          <v-layout>
            <v-flex xs12 class="my-flex">
              <v-card >
                <v-card-text class="px-0">{{ timeslot.start }}~</v-card-text>
              </v-card>
            </v-flex >
            <v-flex xs12 v-for="day in days" :key="day.id"
                    v-on:click="getSlotId(day, timeslot)" >
              <v-card tile
                      v-bind:class="[findIsClicked(day, timeslot) >= 0 ? 'green' : 'my-flex']">
                <v-card-media height="20px">
                </v-card-media>
                <v-card-text class="px-0"></v-card-text>
              </v-card>
              <!--<v-flex xs12 v-for="timeslot in timeslots" :key="timeslot.id">-->
              <!--<v-card>-->
              <!--<v-card-text class="px-0">{{ timeslot.start }}~</v-card-text>-->
              <!--</v-card>-->
            </v-flex>
          </v-layout>

        </v-flex>


        <!--<v-flex xs10>-->
        <!--<v-container grid-list-md text-xs-center>-->
        <!--<v-layout row wrap>-->

        <!--<v-flex xs2 v-for="day in days" :key="day.id">-->
        <!--<v-card dark color="primary">-->
        <!--<v-card-text class="px-0">{{ day.name }}</v-card-text>-->
        <!--</v-card>-->

        <!--<template v-for="timeslot in timeslots">-->
        <!--&lt;!&ndash;<v-flex xs2>&ndash;&gt;-->
        <!--&lt;!&ndash;<v-card>&ndash;&gt;-->
        <!--&lt;!&ndash;<v-card-text class="px-0">{{ timeslot.start }}~</v-card-text>&ndash;&gt;-->
        <!--&lt;!&ndash;</v-card>&ndash;&gt;-->
        <!--<v-flex v-on:click="getSlotId(day, timeslot)"-->
        <!--v-bind:class="{'green' : findIsClicked(day, timeslot) >= 0}"-->
        <!--&gt;-->
        <!--<v-card>-->
        <!--<v-card-text class="px-0"></v-card-text>-->
        <!--</v-card>-->
        <!--</v-flex>-->
        <!--</template>-->



        <!--</v-flex>-->
        <!--</v-layout>-->
        <!--</v-container>-->
        <!--</v-flex>-->
      </v-layout>
    </v-container>
    <v-btn raised @click="save">submit</v-btn>
  </div>
</template>

<script>
  import { auth, db } from '../../firebase';
  import Router from '../../router/index';

  export default {
    created(){
        this.generateDate();
    },
    data () {
      return {
        timetable: [],
        sessionCode: this.$route.params.id,
        newLessonName: '',
        newLessonDay: 0,
        newLessonTimeslot: 0,
        days: [],
        //   [
        //   {
        //     'id': 1,
        //     'name': 'Monday'
        //   },
        //   {
        //     'id': 2,
        //     'name': 'Tuesday'
        //   },
        //   {
        //     'id': 3,
        //     'name': 'Wednesday'
        //   },
        //   {
        //     'id': 4,
        //     'name': 'Thursday'
        //   },
        //   {
        //     'id': 5,
        //     'name': 'Friday'
        //   },
        //   {
        //     'id': 6,
        //     'name': 'Saturday'
        //   }
        // ],
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
        clicked: [{
          'dayId' : 0, 'timeId': 0
        }]
      }
    },
    // watch:{
    //   myColor(){
    //     this.myColor =
    //   }
    // },
    //========================
    methods: {

      save (){
        const code  = this.$route.params.id;
        const dbRefs = db.ref("/session/"+code);
        var startDate;
        dbRefs.once('value').then(
          snapshot => {
            const sId = snapshot.val();
            console.log('sId',sId)
            Object.keys(sId).map(id => {
              console.log('id',id);
              const session = sId[id];
              if (!session.studentTimeslot){
                console.log("not made yet");
                db.ref("/session/"+code+"/"+id).push({Name: "studentTimeslot", Value: this.clicked})
              }
              else{
                console.log("we have one");
              }

              startDate=session.startDate;
            })
        })
      },

      getNextDate(year, month, day){
        if (month==12 && day==31){
          return [year+1, 1, 1]
        }
        else if (day==28 && month==2) {
          return [year, 3, 1]
        }
        else if (day==30 && (month==4 || month==6 || month==9 || month==11 )){
          return [year, month+1, 1]
        }
        else if (day==31){
          return [year, month+1, 1]
        }
        else{
          return [year, month, day+1]
        }
      },

      async generateDate(){
        const code  = this.$route.params.id;
        const dbRefs = db.ref("/session/"+code);
        var startDate;
        dbRefs.once('value').then(
          snapshot => {
            const sId = snapshot.val();
            console.log('sId',sId)
            Object.keys(sId).map(id => {
              console.log('id',id);
              const session = sId[id];
              console.log(session.startDate);
              startDate=session.startDate;
              var dateSplit = startDate.split("/")
              var month = parseInt(dateSplit[1])
              var year = parseInt(dateSplit[2])
              var day = parseInt(dateSplit[0])
              var nextDay;
              var lst = [{
                'id': 1, 'date' : day+"/"+month+"/"+year
              }]
              var i;
              for (i=1;i<7;i++){
                nextDay = this.getNextDate(year, month, day)
                year = nextDay[0]
                month = nextDay[1]
                day = nextDay[2]
                lst.push({'id' : i+1,  'date' : day+"/"+month+"/"+year})
              }
              console.log(lst);
              this.days = lst;
            })
          }
        )
      },

      findIsClicked(day, timeslot){
        var i;
        for (i=0; i < this.clicked.length; i++){
          // console.log(slot)
          if (this.clicked[i]['dayId'] == day.id && this.clicked[i]['timeId'] == timeslot.id){
            // console.log("true")
            // console.log(this.clicked[i]['dayId'])
            return i;
          }
        }
        return -1;
      },

      getSlotId (day, timeslot){
        // console.log(this.clicked)
        console.log(day.id+"-> "+timeslot.id)
        const idx = this.findIsClicked(day, timeslot)
        if (idx >= 0){
          this.clicked.splice(idx, 1)
        }
        else{
          this.clicked.push({'dayId': day.id, 'timeId': timeslot.id})
        }
      }

      // async getWeek(){
      //   const code  = this.$route.params.id;
      //   const dbRefs = db.ref("/session/"+code);
      //   var startDate;
      //   dbRefs.once('value').then(
      //     snapshot => {
      //       const sId = snapshot.val();
      //       console.log('sId',sId)
      //       Object.keys(sId).map(id => {
      //         console.log('id',id);
      //         const session = sId[id];
      //         console.log(session.startDate);
      //         startDate=session.startDate;
      //         return startDate
      //       })
      //     }
      //   )
      // }
    }
  }
</script>

<style scoped>
  green{
    color: #008000;
    padding: 0px
  }
  my-flex{
    padding: 0px
  }

  [draggable] {
    -moz-user-select: none;
    -webkit-user-select: none;
    user-select: none;
    /* Required to make elements draggable in old WebKit */
    -webkit-user-drag: element;
    cursor: move;
    cursor: move;
  }
</style>
