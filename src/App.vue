<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
    >
      <v-list dense>
        <v-list-item
          link
          exact
          :to="{ name: 'home' }"
        >
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              Home
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          link
          :to="{ name: 'stream' }"
        >
          <v-list-item-action>
            <v-icon>mdi-video</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              Publish stream
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-group
          v-if="rooms.length"
          v-model="showRooms"
          :prepend-icon="showRooms ? 'mdi-chevron-up' : 'mdi-chevron-down'"
          append-icon=""
        >
          <template v-slot:activator>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>
                  Streams
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
          <v-list-item
            v-for="(room, i) in rooms"
            :key="i"
            link
            :to="{ name: 'watch', params: { room } }"
          >
            <v-list-item-action>
              <v-icon>mdi-play</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ room }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>

        <v-list-item
          link
          :to="{ name: 'server-usage' }"
        >
          <v-list-item-action>
            <v-icon>mdi-chart-areaspline-variant</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              Server usage
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- <template v-for="item in items">
          <v-row
            v-if="item.heading"
            :key="item.heading"
            align="center"
          >
            <v-col cols="6">
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-col>
            <v-col
              cols="6"
              class="text-center"
            >
              <a
                href="#!"
                class="body-2 black--text"
              >EDIT</a>
            </v-col>
          </v-row>
          <v-list-group
            v-else-if="item.children"
            :key="item.text"
            v-model="item.model"
            :prepend-icon="item.model ? item.icon : item['icon-alt']"
            append-icon=""
          >
            <template v-slot:activator>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ item.text }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <v-list-item
              v-for="(child, i) in item.children"
              :key="i"
              link
            >
              <v-list-item-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{ child.text }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-item
            v-else
            :key="item.text"
            link
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template> -->
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      color="primary"
      dark
      :clipped-left="$vuetify.breakpoint.lgAndUp"
    >
      <div class="d-flex align-center">
        <v-toolbar-title class="headline text-uppercase">
          <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
          <span>WebRTC</span>
        </v-toolbar-title>
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <v-container>
        <!-- <ApolloExample/> -->
        <router-view />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
// import ApolloExample from './components/ApolloExample'

import ROOMS from '@/graphql/Rooms.gql'
import ROOM_ADDED from '@/graphql/RoomAdded.gql'
import ROOM_DELETED from '@/graphql/RoomDeleted.gql'

export default {
  name: 'App',

  components: {
    // ApolloExample,
  },

  data: () => ({
    dialog: false,
    drawer: null,
    rooms: [],
    showRooms: true,
    /* items: [
      { icon: 'mdi-contacts', text: 'Contacts' },
      { icon: 'mdi-history', text: 'Frequently contacted' },
      { icon: 'mdi-content-copy', text: 'Duplicates' },
      {
        icon: 'mdi-chevron-up',
        'icon-alt': 'mdi-chevron-down',
        text: 'Labels',
        model: true,
        children: [
          { icon: 'mdi-plus', text: 'Create label' },
        ],
      },
      {
        icon: 'mdi-chevron-up',
        'icon-alt': 'mdi-chevron-down',
        text: 'More',
        model: false,
        children: [
          { text: 'Import' },
          { text: 'Export' },
          { text: 'Print' },
          { text: 'Undo changes' },
          { text: 'Other contacts' },
        ],
      },
      { icon: 'mdi-settings', text: 'Settings' },
      { icon: 'mdi-message', text: 'Send feedback' },
      { icon: 'mdi-help-circle', text: 'Help' },
      { icon: 'mdi-cellphone-link', text: 'App downloads' },
      { icon: 'mdi-keyboard', text: 'Go to the old version' },
    ], */
  }),

  apollo: {
    rooms: {
      query: ROOMS,
    },
    $subscribe: {
      roomAdded: {
        query: ROOM_ADDED,
        result ({ data }) {
          this.rooms.push(data.roomAdded)
        },
      },
      roomDeleted: {
        query: ROOM_DELETED,
        result ({ data }) {
          this.rooms = this.rooms.filter(name => name !== data.roomDeleted)
        },
      },
    },
  },
}
</script>
