import { defineStore } from 'pinia';

export type AppAlert = {
    message: string | null;
    type: AppAlertType
}

export type AppAlertType = 'alert-success' | 'alert-danger';

export const useAlertStore = defineStore({
    id: 'alert',
    state: () => ({
        alert: null
    } as { alert: AppAlert | null}),
    actions: {
        success(message: string) {
            this.alert = { message, type: 'alert-success' };
        },
        error(message: string) {
            this.alert = { message, type: 'alert-danger' };
        },
        clear() {
            this.alert = null;
        }
    }
});
