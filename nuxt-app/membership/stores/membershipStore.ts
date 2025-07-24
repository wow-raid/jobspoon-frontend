import { defineStore } from "pinia";
import { membershipState } from "./membershipState";
import { membershipAction } from "./membershipActions";

export const useMembershipStore = defineStore("membershipStore", {
  state: membershipState,
  actions: membershipAction,
});
