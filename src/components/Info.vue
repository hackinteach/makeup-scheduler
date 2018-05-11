<template>
  <div>
    <v-container row wrap grid-list-xs text-xs-center :style="{minHeight: '100%',minWidth: '100%'}">
      <v-layout row wrap>
        <v-flex xs-12>
          <p class="display-2">Class Summary</p>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
  import {db} from '../firebase';

  export default {
    data: () => ({
      session: null,
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
          // console.log(sid, this.session);
        })
        .then(() => {
          if (sid !== this.session.id) {
            this.$router.push("/");
          }
        })


    },

    methods: {},
  }
</script>

<style scoped>
</style>
