<template>
  <div>
    <v-container row wrap grid-list-xs text-xs-center :style="{minHeight: '100%',minWidth: '100%'}">
      <v-layout row wrap>
        <v-flex xs-12>
          <p class="display-2">Class Summary</p>
          <!-- URL -->
          <p class="display-1">Share this link to your members</p>
          <a class="headline" :href="url">{{url}}</a>
          <!-- QR CODE -->
          <q-r-code :text="url"/>
          <!-- EMAIL -->
          <p class="title">Send link via email</p>
          <v-select
            v-model="emails"
            label="Email list"
            chips
            tags
            solo
            prepend-icon="email"
            append-icon=""
            clearable
          >
            <template slot="selection" slot-scope="data">
              <v-chip
                :selected="data.selected"
                close
                @input="remove(data.item)"
              >
                <strong>{{ data.item }}</strong>&nbsp;
              </v-chip>
            </template>
          </v-select>
          <v-btn
            @click="sendEmail">
            send
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
  import {db} from '../firebase';
  import QRCode from "vue-qrcode-component";

  export default {
    components: {QRCode},
    data: () => ({
      session: null,
      url: '',
      emails: [],
    }),

    beforeCreate() {
      const sid = this.$route.query.id;
      const sname = this.$route.query.name;
      const dbRef = db.ref('session/' + sname);

      dbRef.once('value').then(snapshot => {
          if (snapshot.val() === null) {
            this.$router.push('/');
          }
          const k = Object.keys(snapshot.val())[0];
          const s = snapshot.val()[k];
          this.session = s;
          this.url = 'makeup-scheduler.firebaseapp.com/session/' + s.id;
          // console.log(sid, this.session);
        })
        .then(() => {
          if (sid !== this.session.id) {
            this.$router.push("/");
          }
        })
    },

    methods: {
      remove (item) {
        this.chips.splice(this.chips.indexOf(item), 1);
        this.chips = [...this.chips]
      },

      sendEmail(){

      }
    },
  }
</script>

<style scoped>
</style>
