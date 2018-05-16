<template>
  <v-container text-xs-center>
    <!--<v-flex xs12>{{// db.ref()}}</v-flex>-->
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
                <v-card-text class="px-0">{{ day.name }}</v-card-text>
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
</template>

<script>
  import { db } from '../../firebase';
  import Router from '../../router/index';

  export default {

    data () {
      return {
        timetable: [],
        sessionCode: this.$route.params.id,
        newLessonName: '',
        newLessonDay: 0,
        newLessonTimeslot: 0,
        // myColor: 'white',
        days: [
          {
            'id': 1,
            'name': 'Monday'
          },
          {
            'id': 2,
            'name': 'Tuesday'
          },
          {
            'id': 3,
            'name': 'Wednesday'
          },
          {
            'id': 4,
            'name': 'Thursday'
          },
          {
            'id': 5,
            'name': 'Friday'
          },
          {
            'id': 6,
            'name': 'Saturday'
          }
        ],
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
        lessons: [
          {
            'id': 1,
            'name': 'UF1',
            'day': 1,
            'timeslot_id': 7
          }
        ],
        availableLessons: [
          {
            'id': 1,
            'name': 'UF1'
          },
          {
            'id': 2,
            'name': 'UF1'
          },
          {
            'id': 3,
            'name': 'UF1'
          },
          {
            'id': 4,
            'name': 'UF1'
          },
          {
            'id': 5,
            'name': 'UF1'
          },
          {
            'id': 6,
            'name': 'UF2'
          },
          {
            'id': 7,
            'name': 'UF2'
          },
          {
            'id': 8,
            'name': 'UF3'
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
      },

      addLesson () {
        const newLesson = {
          'name': this.newLessonName,
          'day': parseInt(this.newLessonDay),
          'timeslot_id': parseInt(this.newLessonTimeslot)
        }
//        console.log(newLesson)
        this.lessons.push(newLesson)
      },
      content (day, timeslot) {
//        console.log('Day:')
//        console.log(day.name)
//        console.log('Timeslot:')
//        console.log(timeslot.start)
//        console.log(timeslot.id)
        const lesson = this.lessons.find(function (lesson) {
          return lesson.day === day.id && lesson.timeslot_id === timeslot.id
        })
        return lesson ? lesson.name : '&nbsp;'
      },
      allowDrop (e) {
        e.preventDefault()
      },
      dropLesson (e, day, timeslot) {
//        console.log(e)
        const lesson = JSON.parse(e.dataTransfer.getData('lesson'))
//        console.log('Lesson is:', lesson)
//        console.log('Lesson name:', lesson.name)
//        console.log('Lesson id:', lesson.id)
//        console.log('Lesson By id:', this.getLessonById(lesson.id))
        // Remove lesson from available availableLessons:
        this.availableLessons.splice(this.availableLessons.indexOf(this.getLessonById(lesson.id)), 1)
//        console.log('DAY:')
//        console.log(day)
//        console.log(day.id)
//        console.log('TIMESLOT:')
//        console.log(timeslot)
//        console.log(timeslot.id)
        this.newLessonName = lesson.name
        this.newLessonDay = day.id
        this.newLessonTimeslot = timeslot.id
        this.addLesson()
      },
      getLessonById (id) {
        return this.availableLessons.find(function (lesson) {
          return lesson.id === id
        })
      },
      startDraggingAvailableLesson (e, lesson) {
//        console.log('Starting drag lesson:')
//        console.log(lesson.name)
//        console.log(lesson)
//        console.log('Event:')
//        console.log(e)
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('lesson', JSON.stringify(lesson))
      }
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
