<template>
  <div class="the-watchers">
    <div class="title mb-2">Watchers:</div>
    <div v-if="watchers.length === 0">none</div>
    <v-chip
      v-for="(watcher, index) in watchers"
      :key="index"
      color="primary"
    >{{ watcher }}</v-chip>
  </div>
</template>

<script>
import WATCHERS from '@/graphql/Watchers.gql'
import WATCHER_JOINED from '@/graphql/WatcherJoined.gql'
import WATCHER_DISCONNECTED from '@/graphql/WatcherDisconnected.gql'

export default {
  name: 'TheWatchers',

  props: {
    room: {
      type: String,
      required: true,
    },
  },

  data: () => ({
    watchers: [],
  }),

  apollo: {
    watchers: {
      query: WATCHERS,
      variables () {
        return {
          room: this.room,
        }
      },
      skip () {
        return !this.room
      },
    },
    $subscribe: {
      watcherJoined: {
        query: WATCHER_JOINED,
        variables () {
          return {
            room: this.room,
          }
        },
        skip () {
          return !this.room
        },
        result ({ data }) {
          this.watchers.push(data.watcherJoined)
        },
      },
      watcherDisconnected: {
        query: WATCHER_DISCONNECTED,
        variables () {
          return {
            room: this.room,
          }
        },
        skip () {
          return !this.room
        },
        result ({ data }) {
          const index = this.watchers.findIndex(name => name === data.watcherDisconnected)
          if (index >= 0) {
            this.$delete(this.watchers, index)
          }
        },
      },
    },
  },
}
</script>
