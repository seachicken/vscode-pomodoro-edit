declare module "pomodoro-edit-core" {
    export default class Core {
        constructor();
        findAndStartTimer(text: string, filePath: string, callbacks: Callbacks): void;
    }

    export interface Callbacks {
        start?: () => void;
        interval?: (remaining: number, ptext: PomodoroText) => void;
        finish?: (ptext: PomodoroText) => void;
        cancel?: () => void;
    }

    export interface PomodoroText {
        id: string;
        line: number;
        checkboxCh: number;
        operator: string;
        time: number;
        extraTime: number;
        content: string;
    }
}