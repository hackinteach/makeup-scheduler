<template>
  <v-container :style="{marginTop:'2em'}" grid-list-xs text-xs-center>
    <v-layout row wrap>
      <v-flex d-flex xs12 md6 fill-height>
        <AddSession/>
      </v-flex>
      <v-flex xs12 md6 fill-height>
        <JoinSession/>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import AddSession from './AddSession';
  import JoinSession from "./JoinSession";

  export default {
    components: {
      JoinSession,
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
