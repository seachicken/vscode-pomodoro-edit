import { ExtensionContext, workspace, ProgressLocation, window, Progress } from 'vscode';
import * as path from 'path';
import { Duration } from 'luxon';
import Core from 'pomodoro-edit-core';

let core: Core;

export function activate(context: ExtensionContext) {
	core = new Core();

	const progressWrapper: {
		progress?: Progress<{
			message?: string;
			increment?: number;
		}>,
		resolve?: () => void,
		reject?: () => void
	} = {};
	
	core.runServer(62115);

	workspace.onDidSaveTextDocument(document => {
		if (!isTarget(document.languageId)) {
			return;
		}

		core.findAndStartTimer(document.getText(), document.fileName, {
			start: () => {
				const task: any = window.withProgress<void>({ location: ProgressLocation.Notification }, p => {
					progressWrapper.progress = p;
					return new Promise((resolve, reject) => {
						progressWrapper.resolve = resolve;
						progressWrapper.reject = reject;
					});
				});
				context.subscriptions.push(task);
			},
			interval: (remainingSec, durationSec, stepNos, ptext) => {
				if (progressWrapper.progress) {
					const displayTime = Duration.fromMillis(remainingSec * 1000).toFormat('m:ss');
					progressWrapper.progress.report({
						increment: 100 / durationSec,
						message: `${ptext.content} (${displayTime}${stepNos ? ' #' + stepNos : ''})`
					});
				}
			},
			step: ptext => {
				if (progressWrapper.progress) {
					progressWrapper.progress.report({ increment: -100, message: ptext.content });
				}

				if (!core.runningServer()) {
					window.showInformationMessage(`🍅 Go to the next step\n${ptext.content}`, { modal: true });
				}
			},
			finish: ptext => {
				if (progressWrapper.resolve) {
					progressWrapper.resolve();
				}

				if (!core.runningServer()) {
					window.showInformationMessage(`🍅 Finished!\n${ptext.content}`, { modal: true });
				}
			},
			cancel: () => {
				if (progressWrapper.reject) {
					progressWrapper.reject();
				}
			}
		});
	});
}

function isTarget(languageId: string): boolean {
	// https://code.visualstudio.com/docs/languages/identifiers#_known-language-identifiers
	return languageId === 'markdown' || languageId === 'plaintext';
}

export function deactivate() {
	core.closeServer();
	core.stopTimer();
}
