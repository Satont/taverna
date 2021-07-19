import Vue from 'vue';
import Component from 'vue-class-component';
import { isInCommunity } from '../commons/isInCommunity';

@Component
export class Permissions extends Vue {
  isInCommunity = () => isInCommunity();
}
