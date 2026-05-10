import { contextBridge } from "electron";

const focusFlowApi = {
  platform: process.platform
};

contextBridge.exposeInMainWorld("focusFlow", focusFlowApi);

export type FocusFlowApi = typeof focusFlowApi;
