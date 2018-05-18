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
  import firebase from 'firebase';
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
        const {username, password, code} = this;
        const dummyEmail = username + "@makeupscheduler.com";

        const dbRefs = db.ref("/session");
        // console.log('code',code);
        dbRefs.once('value').then(
          snapshot => {
            const sessions = snapshot.val();
            // console.log("sessions",sessions);
            Object.values(sessions).map(
              s => {
                const key = Object.keys(s)[0];
                Object.values(s).map(
                  session => {
                    const existingUser = session.existUser;
                    // console.log(existingUser);
                    let userExists = false;
                    if(existingUser != null){
                      Object.values(existingUser).map(u => {
                        if(username === u)
                          userExists = true;
                      });
                    }
                    if (session.id === code && userExists) {
                      this.$store.dispatch('userSignIn', {email: dummyEmail, password: password, code: code})
                      // console.log("Logged in");
                      // auth.signInWithEmailAndPassword(dummyEmail, password)
                      //   .then(()=>{
                      //     auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
                      //       .then(
                      //         ()=>this.$router.push("/session/"+code)
                      //       )
                      //   })
                    }else if(session.id === code && !userExists){
                      // console.log("User created");
                      // auth.createUserWithEmailAndPassword(dummyEmail, password)
                      //   .then(() => {
                      //     const userRefs = db.ref(`/session/${code}/${key}/existUser`);
                      //     userRefs.push(username);
                      //     auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
                      //       .then(
                      //         ()=>this.$router.push("/session/"+code)
                      //       );
                      //   })
                      //   .catch(err => alert(err));
                      this.$store.dispatch('userSignUp',{email:dummyEmail, password: password, code: code});
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
