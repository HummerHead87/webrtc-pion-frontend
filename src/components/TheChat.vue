<template>
  <v-card class="the-chat">
    <v-card-title>Chat</v-card-title>
    <v-card-text class="the-chat__content">
      <v-alert
        v-for="message in messages"
        :key="message.id"
        border="top"
        color="indigo"
        dark
      >{{ message.user}}: {{ message.text }}</v-alert>
    </v-card-text>
    <v-card-actions>
      <v-text-field
        v-model="text"
        label="Type a message"
        @keyup.enter="postMessage"
      ></v-text-field>
    </v-card-actions>
  </v-card>
</template>

<script>
import POST_MESSAGE from '../graphql/PostMessage.gql'
import MESSAGE_POSTED from '../graphql/MessagePosted.gql'

export default {
  name: 'TheChat',

  props: {
    room: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
  },

  data: () => ({
    messages: [],
    text: '',
  }),

  apollo: {
    $subscribe: {
      messagePosted: {
        query: MESSAGE_POSTED,
        skip () {
          return !this.room || !this.user
        },
        variables () {
          return {
            room: this.room,
            user: this.user,
          }
        },
        result ({ data }) {
          this.messages.push(data.messagePosted)
        },
      },
    },
  },

  methods: {
    async postMessage () {
      if (!this.text) return

      try {
        const data = await this.$apollo.mutate({
          mutation: POST_MESSAGE,
          variables: {
            room: this.room,
            user: this.user,
            text: this.text,
          },
        })

        console.log(data)
        this.text = ''
      } catch (err) {
        alert(err)
      }
    },
  },
}
</script>

<style lang="less">
  .the-chat {
    &__content {
      height: 300px;
      overflow-y: auto;
    }
  }
</style>
