<template>
  <div class="server-usage">
    <cpu-ram-usage />
  </div>
</template>

<script>
import CpuRamUsage from '@/components/CpuRamUsage'

export default {
  name: 'ServerUsage',
  components: {
    CpuRamUsage,
  },
}
</script>
