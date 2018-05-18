<template>
  <div>
    <v-layout row justify-center>
      <v-btn color="primary" dark @click.stop="dialog2 = true">Session Information</v-btn>
      <v-dialog v-model="dialog2" max-width="500px">
        <v-container row wrap grid-list-xs text-xs-center>
          <v-layout row wrap>
            <v-flex xs12 class="the-flex">
              <v-card flat class="my-card">
                <p class="headline">Class Summary : {{session.name}}</p>
                <!-- CODE -->
                <a class="subheading" :style="{color: 'black'}">Join Code</a>
                <v-flex xs12>
                  <v-card :flat="true" color="grey lighten-2">
                    <a class="display-3">
                      {{session.id}}
                    </a>
                  </v-card>
                </v-flex>
                <v-divider class="divider"/>
                <!-- URL -->
                <v-icon>insert_link</v-icon>
                <a class="subheading" :style="{color: 'black'}"> Share this link to your members</a>
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
                <v-btn :disabled="emailEmpty" @click="sendMail">
                  <v-icon color="grey darken-2">send</v-icon>
                </v-btn>
                <v-divider class="divider"/>
                <v-btn
                  @click="dialog2 = false" color="primary" raised>Close</v-btn>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-dialog>
    </v-layout>
  </div>
</template>

<script>
  import {db, func} from '../firebase';
  import QRCode from "vue-qrcode-component";

  export default {
    components: {QRCode},
    data: () => ({
      session: {id: ""},
      url: '',
      emails: [],
      emailEmpty: true,
      dialog2: false,

    }),

    created() {
      // console.log(this.$route.params);
      const sid = this.$route.params.id;
      // console.log(sid);
      if (!sid) {
        this.$router.push('/');
        return;
      }
      const dbRef = db.ref('session/' + sid);

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
          if (sid !== this.session.id || sid === null) {
            this.$router.push("/");
          }
        })
        .catch(error => {
          alert(error)
          this.$router.push("/");
        })
    },

    watch: {
      emails() {
        this.emailEmpty = this.emails.length === 0;
      }
    },

    methods: {
      remove(item) {
        this.emails.splice(this.emails.indexOf(item), 1);
        this.emails = [...this.emails]
      },

      sendMail() {
        const link = 'https://' + this.url;
        const {id, owner,name} = this.session;
        const {username} = owner;
        const dbRefs = db.ref("/emailProxy");
        this.emails.forEach(mail => {
          dbRefs.push({
            mail: mail,
            owner: username,
            code: id,
            link: link,
            name: name,
          });
        });
        this.emails = [];
        alert("Email sent !");
      },

    },
  }
</script>

<style scoped>
  .qr-img {
    display: block;
    margin-right: auto;
    margin-left: auto;
    width: 80%;
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

  .my-card {
    margin: 2em;
    padding: 2em;
  }

  .the-flex {
    background-color: white;
  }

</style>
