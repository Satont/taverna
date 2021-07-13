import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export class Permissions extends Vue {
  isInCommunity = () => {
    return Boolean(this.$store.state.meta?.users.find((u) => u._id === this.$store.state.user.id));
  };
}
