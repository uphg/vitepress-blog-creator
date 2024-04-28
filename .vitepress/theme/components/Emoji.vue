<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'

const emojis = ['😐', '😎', '🤐', '😊', '🤔', '🙂', '😘', '😜', '🤪', '🤩', '😑', '🙄', '😳', '🤤', '👏', '😉']

export default defineComponent({
  setup() {
    const emoji = ref<any>(null)
    onMounted(() => {
      let local = sessionStorage.getItem("emoji");
      if (!local) {
        const index = Math.floor(Math.random() * emojis.length);  
        sessionStorage.setItem('emoji', emojis[index]);
        local = emojis[index]
      }
      emoji.value = local
    })
    return () => emoji.value
  }
})
</script>