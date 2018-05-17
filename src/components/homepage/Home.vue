<template>
    <v-container row wrap grid-list-xs text-xs-center :style="{minHeight: '100%',minWidth: '100%'}">
      <v-layout row wrap >
        <v-layout fill-height row wrap>
          <v-flex class="my-flex" xs12 md6 :style="{backgroundImage: `url(${require('../../assets/bg/l.jpg')})`,backgroundPosition: 'right center'}">
            <AddSession/>
          </v-flex>
          <v-flex class="my-flex" xs12 md6 :style="{backgroundImage: `url(${require('../../assets/bg/r.jpg')})`,  backgroundPosition: 'center center'}">
            <JoinSession/>
          </v-flex>
        </v-layout>
      </v-layout>
    </v-container>
</template>

<script>
  import AddSession from './AddSession';
  import JoinSession from "./JoinSession";
  import Session from "./Personal";
  export default {
    components: {
      JoinSession,
      AddSession,
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

  .my-flex {
    min-height: 100%;
    padding: 2em;
  }

</style>
