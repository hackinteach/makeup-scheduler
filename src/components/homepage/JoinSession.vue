<template>
  <v-card :style="{backgroundColor: 'rgba(255,255,255,0.9)',margin:'4em', padding: '1.5em'}">
    <v-toolbar-title>Join Session</v-toolbar-title>
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
      :style="{margin:'1em'}"
    >
      <v-subheader class="form-subheader">Sign in / Sign up</v-subheader>
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
        <v-spacer/>
      <v-text-field
        v-model="code"
        :rules="codeRule"
        label="Class code"
        required
      />
      <v-btn
        :disabled="!valid"
        @click="join"
      >
        join
      </v-btn>
        <p class="caption text-xs-left">Sign in for returning user in the class. If this is the first time, just choose password.</p>
      </v-container>
    </v-form>
  </v-card>
</template>

<script>
  import {auth,db} from '../../firebase';
  export default{
    data: () => ({
      valid: false,
      code: '',
      username: '',
      password: '',
      passwordRule: [
        v => !!v || 'Password is required',
        v => /^......*$/.test(v) || 'Password too weak'
      ],
      usernameRule: [
        v => !!v || 'Username is required',
        v => /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/.test(v) || 'Invalid username'
      ],
      codeRule: [
        c => /^[a-zA-Z0-9_.-]*$/.test(c) || 'Code must be alphabet or number'
      ]
    }),

    watch: {
      valid(){
        this.valid = this.$refs.form.validate();
      },
    },

    methods: {
      join() {
        const dummyEmail = this.username + "@makeupscheduler.com";
        const password = this.password;
        const code = this.code;

        const dbRefs = db.ref("/session");
        // console.log('code',code);
        dbRefs.once('value').then(
          snapshot => {
            const sessions = snapshot.val();
            // console.log("sessions",sessions);
            Object.values(sessions).map(
              s => {
                Object.values(s).map(
                  session => {
                    if (session.id === code) {
                      auth.createUserWithEmailAndPassword(dummyEmail, password)
                        .then(() => {
                          this.$router.push("/session/" + code);
                        })
                        .catch(err => alert(err));
                    }
                  }
                )
              }
            );
          }
        )

      },
    }
  }
</script>

<style scoped>
  .form-container {
    padding: 2em;
  }

  p {
    margin-top: 1em;
  }

  .form-subheader {
    color: midnightblue;
  }
</style>
