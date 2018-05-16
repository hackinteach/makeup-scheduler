<template>
  <v-card :style="{backgroundColor: 'rgba(255,255,255,0.9)', margin:'4em', padding: '1.5em'}">
    <v-toolbar-title>Create Session</v-toolbar-title>

    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
      :style="{margin:'1em'}"
    >
      <v-subheader class="sub-header">
        User account
      </v-subheader>
      <v-divider/>
      <v-container row wrap xs6 text-xs-center class="form-container">
        <v-text-field
          v-model="username"
          :rules="usernameRule"
          label="Username"
          hint="A-Z, a-z, 0-9, - , _"
          required
        />
        <v-text-field
          v-model="password"
          :rules="passwordRule"
          label="Password"
          hint="at least 6 characters"
          required
          type="password"
        />
        <v-text-field
          v-model="email"
          :rules="emailRule"
          label="Email"
          required
        />
        <p class="caption">We will send the join code via email.</p>
        <v-spacer/>
      </v-container>
      <v-subheader class="sub-header">
        Class details
      </v-subheader>
      <v-divider/>
      <v-container row wrap xs6 text-xs-center class="form-container">
        <v-text-field
          v-model="subject"
          :rules="subjectRule"
          label="Class name"
          required
        />
        <v-select
          :items="periods"
          v-model="classPeriod"
          label="Class Period"
          class=""
          item-value="text"
          single-line
        ></v-select>
        <v-menu
          ref="menu1"
          :close-on-content-click="false"
          v-model="menu1"
          :nudge-right="40"
          lazy
          transition="scale-transition"
          offset-y
          full-width
          max-width="290px"
          min-width="290px"
        >
          <v-text-field
            slot="activator"
            v-model="startDateFormatted"
            label="Start Date"
            hint="DD/MM/YYYY format"
            persistent-hint
            prepend-icon="event"
            @blur="startDate = parseDate(startDateFormatted)"
          ></v-text-field>
          <v-date-picker
            v-model="startDate"
            no-title
            @input="menu1 = false"
          ></v-date-picker>
        </v-menu>
        <v-menu
          ref="menu2"
          :close-on-content-click="false"
          v-model="menu2"
          :nudge-right="40"
          lazy
          transition="scale-transition"
          offset-y
          full-width
          max-width="290px"
          min-width="290px"
        >
          <v-text-field
            slot="activator"
            v-model="endDateFormatted"
            label="End Date"
            hint="DD/MM/YYYY format"
            persistent-hint
            prepend-icon="event"
            @blur="endDate = parseDate(endDateFormatted)"
          />
          <v-date-picker
            v-model="endDate"
            no-title
            @input="menu2 = false"/>
        </v-menu>
        <v-text-field
          name="description"
          label="Class Description"
          v-model="description"
          :counter="50"
          multi-line/>
        <v-btn
          :disabled="!valid"
          @click="submit"
        >
          create
        </v-btn>
      </v-container>
    </v-form>
  </v-card>
</template>

<script>
  import {auth, db} from '../../firebase';
  import firebase from 'firebase';
  import router from "vue-router";

  export default {
    data: () => ({
      startDate: '',
      startDateFormatted: '',
      endDate: '',
      endDateFormatted: '',
      description: '',
      username: '',
      password: '',
      menu1: false,
      menu2: false,
      valid: false,
      classPeriod: 0,
      periods: [
        {text: 1},
        {text: 2},
        {text: 3},
        {text: 4}
      ],
      email: '',
      emailRule: [
        v => !!v || 'E-mail is required',
        v => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  .test(v) || 'E-mail must be valid'
      ],
      subject: '',
      subjectRule: [
        v => !!v || 'Class name is required'
      ],
      passwordRule: [
        v => !!v || 'Password is required',
        v => /^......*$/.test(v) || 'Password too weak'
      ],
      usernameRule: [
        v => !!v || 'Username is required',
        v => /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/.test(v) || 'Invalid username'
      ]
    }),

    watch: {
      startDate(val) {
        this.startDateFormatted = this.formatDate(this.startDate)
      },
      endDate(val) {
        this.endDateFormatted = this.formatDate(this.endDate)
      },
      valid(val) {
        this.valid = this.$refs.form.validate()
      }
    },

    methods: {
      formatDate(date) {
        if (!date) return null;

        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`
      },
      parseDate(date) {
        if (!date) return '';

        const [month, day, year] = date.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      },
      submit(e) {
        e.preventDefault();
        if (this.$refs.form.validate()) {
          const {classPeriod, startDateFormatted, endDateFormatted, description, email, subject, username, password} = this.$data;
          auth.createUserWithEmailAndPassword(email, password)
            .then(() => {
              const user = auth.currentUser.uid;
              const sid = Math.random().toString(36).substring(2, 8) + Math.random().toString(36).substring(2, 5);
              const dbRefs = db.ref('session/'+subject );
              dbRefs.push(
                /* Session object */
                {
                  startDate: startDateFormatted,
                  endDate: endDateFormatted,
                  description: description,
                  owner: {
                    uid: user,
                    username: username,
                    email: email,
                  },
                  classPeriod: classPeriod,
                  users: [],
                  id: sid,
                  name: subject
                })
                .then(
                  snapshot => {
                    this.$router.push(
                      {
                        path: 'info',
                        query:
                          {
                            id: sid,
                            name: subject
                          }
                      }
                    )
                  }
                )
                .catch(err => alert(err))
                .catch(err => alert(err));
            })
        }

      }
    }
  }
</script>

<style scoped>
  .sub-header {
    color: midnightblue;
  }

  .form-container {
    padding: 2em;
  }
</style>
