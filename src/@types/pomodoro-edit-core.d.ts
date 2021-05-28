declare module "pomodoro-edit-core" {
    export default class Core {
        constructor();
        findAndStartTimer(text: string, filePath: string, callbacks: Callbacks): void;
    }

    export interface Callbacks {
        start?: () => void;
        interval?: (remainingSec: number, durationSec: number, stepNos: string, ptext: PomodoroText) => void;
        step?: (ptext: PomodoroText) => void;
        finish?: (ptext: PomodoroText) => void;
        cancel?: () => void;
    }

    export interface PomodoroText {
        id: string;
        line: number;
        checkboxOffset: number;
        operator: string;
        content: string;
    }
}