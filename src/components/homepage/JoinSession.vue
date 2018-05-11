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
        create
      </v-btn>
        <p class="caption text-xs-left">Sign in for returning user in the class. If this is the first time, just choose password.</p>
      </v-container>
    </v-form>
  </v-card>
</template>

<script>
  export default{
    data: () => ({
      valid: false,
      code: '',
      codeRule: [
        c => /^[a-zA-Z0-9_.-]*$/.test(c) || 'Code must be alphabet or number'
      ]
    }),

    watch: {
      valid(){
        this.valid = this.$refs.form.validate();
      }
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
