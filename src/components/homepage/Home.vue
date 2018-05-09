<template>
  <v-container :style="{marginTop:'2em'}" grid-list-xs text-xs-center>
    <v-layout row wrap>
      <v-flex xs6>
        <AddSession/>
      </v-flex>
      <v-flex xs6>
        <div class="text-xs-center mt-3">
          <v-btn outline large block color="deep-purple darken-3">
            <v-icon x-large >group</v-icon>
          </v-btn>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import AddSession from './AddSession';
  export default {
    components: {
      AddSession
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
