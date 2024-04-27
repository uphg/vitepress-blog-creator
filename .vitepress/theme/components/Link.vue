<script lang="ts">
import { isString } from "lodash-es"
import { type PropType, defineComponent, h, computed } from "vue"
import { base } from '@/shared/common'

export default defineComponent({
  props: {
    to: [String, Number] as PropType<string | number | null>,
    disabled: Boolean as PropType<boolean>,
  },
  setup(props, context) {
    const to = computed(() => props.disabled
      ? null
      : base + (isString(props.to) ? props.to.replace(/^\//, '') : props.to))

    return () => {
      return h(to.value ? 'a' : 'span', { class: { disabled: props.disabled }, ...(to.value ? { href: to.value } : {}) }, context.slots.default?.())
    }
  }
})
</script>

<style scoped>
.disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
</style>