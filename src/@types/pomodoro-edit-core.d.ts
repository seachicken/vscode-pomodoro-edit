declare module "pomodoro-edit-core" {
    export default class Core {
        constructor();
        findAndCountPomodoroText(text: string, filePath: string, callbacks: Callbacks): void;
    }

    export interface Callbacks {
        start?: () => void;
        interval?: (remaining: number, ptext: PomodoroText) => void;
        finish?: (ptext: PomodoroText) => void;
        cancel?: () => void;
    }

    export interface PomodoroText {
        time: number;
        content: string;
    }
}