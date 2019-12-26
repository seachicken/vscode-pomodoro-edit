declare module "pomodoro-edit-core" {
    export default class Core {
        constructor();
        findAndCountPomodoroText(text: string, callbacks: Callbacks): void;
    }

    export interface Callbacks {
        interval: (time: number) => void;
        finish: (ptext: PomodoroText) => void;
        stop: () => void;
    }

    export interface PomodoroText {
        time: number;
        content: string;
    }
}