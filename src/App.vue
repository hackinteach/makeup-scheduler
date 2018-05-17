<template>
  <v-app>
    <v-toolbar
      app
      :clipped-left="clipped"
    >
      <v-container text-xs-center>
        <v-toolbar-title v-text="title"></v-toolbar-title>
        <v-spacer></v-spacer>
      </v-container>
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
    <!--<v-footer :fixed="fixed" app>-->
      <!--<span>&copy; 2017</span>-->
    <!--</v-footer>-->
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      clipped: true,
      drawer: false,
      fixed: false,
      items: [{
        icon: 'bubble_chart',
        title: 'Inspire'
      }],
      miniVariant: false,
      right: true,
      title: 'Makeup Scheduler'
    }
  },
  name: 'App'
}
</script>
