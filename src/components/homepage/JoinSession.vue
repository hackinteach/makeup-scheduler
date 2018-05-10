<template>
  <v-card :style="{margin:'1em', padding: '1.5em'}">
    <v-toolbar-title>Join Session</v-toolbar-title>
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
      :style="{margin:'1em'}"
    >
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
