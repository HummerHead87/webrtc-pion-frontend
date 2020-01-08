<template>
  <div class="stream">
    <h1>Stream page</h1>
    <v-row align="center">
      <v-col cols="4">
        <v-text-field
          v-model="name"
          label="Your name"
          :disabled="state === 'connected'"
        />
      </v-col>
      <v-col>
        <v-btn
          @click="onPublish"
          :disabled="state === 'connected' || !name"
        >Publish</v-btn>
        <v-btn
          v-if="state === 'connected'"
          class="ml-4"
          @click="onDisconnect"
        >Disconnect</v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" sm="6">
        <video
          class="stream__video"
          autoplay
          muted
          controls
          ref="video"
        >
        </video>
      </v-col>
      <v-col cols="12" sm="6">
        <the-watchers
          v-if="state === 'connected'"
          :room="name"
        />
        <the-chat
          v-if="state === 'connected'"
          class="mt-4"
          :room="name"
          :user="name"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import PUBLISH_STREAM from '@/graphql/PublishStream.gql'

import TheWatchers from '@/components/TheWatchers'
import TheChat from '@/components/TheChat'

export default {
  name: 'Stream',

  components: {
    TheWatchers,
    TheChat,
  },

  data: () => ({
    name: '',
    localSDP: '',
    remoteSDP: '',
    pc: undefined,
    state: undefined,
  }),

  mounted () {
    this.pc = new RTCPeerConnection({
      iceServers: [
        {
          urls: process.env.VUE_APP_STUN_SERVER,
        },
      ],
    })

    this.pc.oniceconnectionstatechange = e => {
      // log(pc.iceConnectionState)
      this.state = this.pc.iceConnectionState
      console.log(this.pc.iceConnectionState)
    }

    this.pc.onicecandidate = event => {
      if (event.candidate === null) {
        this.localSDP = this.pc.localDescription.sdp
        // document.getElementById('localSDP').value = pc.localDescription.sdp;
        // <!-- document.getElementById('localSDP').value = pc.localDescription.sdp; -->
        // sock.send(pc.localDescription.sdp);
        // <!-- console.log("send sdp to server:==============\n" + pc.localDescription.sdp); -->
      }
    }

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        this.pc.addStream(this.$refs.video.srcObject = stream)
        this.pc.createOffer()
          .then(d => {
            this.pc.setLocalDescription(d)
          })
          .catch(this.log)
        // dataChannel = this.pc.createDataChannel('data')
      }).catch(this.log)
    console.log('Publisher createOffer')
  },

  methods: {
    async onPublish () {
      if (!this.name) return

      try {
        const data = await this.$apollo.mutate({
          mutation: PUBLISH_STREAM,
          variables: {
            user: this.name,
            sdp: this.pc.localDescription.sdp,
          },
        })

        this.remoteSDP = data.data.publishStream

        this.pc.setRemoteDescription(new RTCSessionDescription({
          type: 'answer',
          sdp: this.remoteSDP,
        }))
      } catch (err) {
        alert(err)
      }
    },

    onDisconnect () {
      this.pc.close()
    },

    log () {
      console.log(...arguments)
    },
  },
}
</script>

<style lang="less">
  .stream {
    &__video {
      width: 100%;
    }
  }
</style>
