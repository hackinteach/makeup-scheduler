<template>
    <v-card :style="{margin:'1em', padding: '1.5em'}">
      <v-toolbar-title>Create Session</v-toolbar-title>
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
        :style="{margin:'1em'}"
      >
        <v-text-field
          v-model="email"
          :rules="emailRule"
          label="Email"
          required
        />
        <v-text-field
          v-model="subject"
          :rules="subjectRule"
          label="Class name"
          required
        />
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
          />
        </v-menu>
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
            @input="menu1 = false"/>
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
      </v-form>
    </v-card>
</template>

<script>
  export default {
    data: () => ({
      startDate: null,
      startDateFormatted: null,
      endDate: null,
      endDateFormatted: null,
      description: '',
      menu1: false,
      valid: true,
      email: '',
      emailRule: [
        v => !!v || 'E-mail is required',
        v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
      ],
      subject: '',
      subjectRule: [
        v => !!v || 'Class name is required'
      ],
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
        if (!date) return null;

        const [month, day, year] = date.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      },
      submit() {
        if (this.$refs.form.validate()) {
          console.log("Submitted");
        }
      }
    }
  }
</script>
