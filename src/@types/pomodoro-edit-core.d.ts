declare module "@seachicken/pomodoro-edit-core" {
    export default class Core {
        constructor();
        findAndStartTimer(text: string, filePath: string, callbacks: Callbacks): void;
        stopTimer(): void;
        runServer(port: number): void;
        closeServer(): void;
        runningServer(): boolean;
    }

    export interface Callbacks {
        start?: () => void;
        interval?: (remainingSec: number, durationSec: number, stepNos: string, symbol: string, ptext: PomodoroText) => void;
        step?: (stepNos: string, symbol: string, ptext: PomodoroText) => void;
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

    export function getReplacementRange(lineText: string, cursorPos: Position, bullet: string):
        { found: boolean, start: Position, end: Position };

    export interface Position {
        line: number;
        ch: number;
    }
}
