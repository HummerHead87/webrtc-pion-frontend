<template>
  <div class="watch">
    <h1>Watch page</h1>
    <v-row>
      <v-col cols="6">
        <video
          class="watch__video"
          autoplay
          muted
          controls
          ref="video"
        >
        </video>
      </v-col>
      <v-col cols="6">
        <v-row align="center">
          <v-col>
            <v-text-field
              v-model="name"
              label="Your name"
              :disabled="state === 'connected'"
            />
          </v-col>
          <v-col>
            <v-btn
              @click="onWatch"
            >Watch</v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import WATCH_STREAM from '@/graphql/WatchStream.gql'

export default {
  name: 'Watch',
  props: {
    room: {
      type: String,
      required: true,
    },
  },

  data: () => ({
    name: 'name',
    state: undefined,
    localSDP: undefined,
    remoteSDP: undefined,
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

    this.pc.addTransceiver('audio', { 'direction': 'recvonly' })
    this.pc.addTransceiver('video', { 'direction': 'recvonly' })

    this.pc.createOffer()
      .then(d => this.pc.setLocalDescription(d))
      .catch(this.log)

    this.pc.ontrack = (event) => {
      var el = this.$refs.video
      el.srcObject = event.streams[0]
      el.autoplay = true
      el.controls = true
    }
  },

  methods: {
    log () {
      debugger
      console.log(...arguments)
    },

    async onWatch () {
      if (!this.name) return

      try {
        const data = await this.$apollo.mutate({
          mutation: WATCH_STREAM,
          variables: {
            stream: this.room,
            user: this.name,
            sdp: this.pc.localDescription.sdp,
          },
        })

        this.remoteSDP = data.data.watchStream

        this.pc.setRemoteDescription(new RTCSessionDescription({
          type: 'answer',
          sdp: this.remoteSDP,
        }))
      } catch (err) {
        alert(err)
      }
    },
  },
}
</script>

<style lang="less">
  .watch {
    &__video {
      width: 100%;
    }
  }
</style>
