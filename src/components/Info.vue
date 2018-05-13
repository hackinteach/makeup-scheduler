<template>
  <div class="bgImg">
    <v-container row wrap grid-list-xs text-xs-center>
      <v-layout row wrap>
        <v-flex sm2/>
        <v-flex xs12 sm8>
          <v-card raised class="my-card">
            <p class="headline">Class Summary</p>
            <!-- URL -->
            <v-icon>insert_link</v-icon>
            <a class="subheading"> Share this link to your members</a>
            <v-flex>
              <a class="body-1" :href="'https://'+url">https://{{url}}</a>
            </v-flex>
            <v-divider class="divider"/>

            <!-- QR CODE -->
            <q-r-code class="qr-img" :style="{marginLeft: 'auto', margiRight: 'auto'}" :size="100" :text="url"/>
            <!-- EMAIL -->

            <v-divider class="divider"/>
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
              class="email-select"
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
          </v-card>
        </v-flex>
        <v-flex sm2/>
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
      remove(item) {
        this.chips.splice(this.chips.indexOf(item), 1);
        this.chips = [...this.chips]
      },

      sendEmail() {

      }
    },
  }
</script>

<style scoped>

  .qr-img {
    display: block;
    margin-right: auto;
    margin-left: auto;
    width: 50%;
  }

  .email-select {
    max-width: 80%;
    /*margin-left: auto;*/
    /*margin-right: auto;*/
    /*margin-top: 1em;*/
    /*margin-bottom: 1em;*/
    margin: 1em auto 1em;
  }

  .divider {
    margin: 1em 0 1em;
  }

  .my-card{
    margin: 2em;
    padding: 2em;
  }

  .bgImg{
    background-image: url("../assets/bg/2.jpg");
    min-height: 100%;
    background-size: cover;
  }

</style>
