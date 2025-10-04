import { defineStore } from "pinia";
import {metaAuthenticationState} from "./metaAuthenticationState.ts";
import {metaAuthenticationAction} from "@/meta/stores/metaAuthenticationActions.ts";

export const useMetaAuthenticationStore = defineStore(
    "metaAuthenticationStore",
    {
        state: metaAuthenticationState,
        actions: metaAuthenticationAction,
    }
);
