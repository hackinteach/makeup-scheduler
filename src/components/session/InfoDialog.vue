<template>
  <div>
    <v-layout row justify-center>
      <v-btn color="primary" dark @click.stop="dialog2 = true">Session Information</v-btn>
      <v-menu bottom offset-y>
        <v-btn slot="activator">A Menu</v-btn>
        <v-list>
          <v-list-tile v-for="(item, i) in items" :key="i" @click="">
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
      <v-dialog v-model="dialog2" max-width="500px">
        <v-card raised class="my-card">
          <p class="headline">Class Summary</p>
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
            @click="next">
            next
          </v-btn>
        </v-card>
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
      session: null,
      url: '',
      emails: [],
      emailEmpty: true,
    }),

    beforeCreate() {
      const sid = this.$route.params.id;
      if (!sid){
        this.$router.push('/');
        return;
      }
      const dbRef = db.ref('session/' + id);

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
  }
</script>
