import { ExtensionContext, StatusBarAlignment, workspace, ProgressLocation, window, Progress } from 'vscode';
import * as path from 'path';
import { Duration } from 'luxon';
import Core from 'pomodoro-edit-core';

export function activate(context: ExtensionContext) {
	const core = new Core();
	const statusBarItem = window.createStatusBarItem(StatusBarAlignment.Right, 100);
	context.subscriptions.push(statusBarItem);

	const progressWrapper: {
		progress?: Progress<{
			message?: string;
			increment?: number;
		}>,
		resolve?: () => void,
		reject?: () => void
	} = {};

	workspace.onDidSaveTextDocument(document => {
		if (!isTarget(document.fileName)) {
			return;
		}

		core.findAndCountPomodoroText(document.getText(), {
			start: () => {
				const task: any = window.withProgress({ location: ProgressLocation.Notification }, p => {
					progressWrapper.progress = p;
					return new Promise((resolve, reject) => {
						progressWrapper.resolve = resolve;
						progressWrapper.reject = reject;
					});
				});
				context.subscriptions.push(task);
			},
			interval: (remaining, ptext) => {
				if (progressWrapper.progress) {
					progressWrapper.progress.report({ increment: 100 / ptext.time, message: ptext.content });
				}

				statusBarItem.text = `$(clock) ${Duration.fromMillis(remaining * 1000).toFormat('mm:ss')}`;
				statusBarItem.show();
			},
			finish: ptext => {
				if (progressWrapper.resolve) {
					progressWrapper.resolve();
				}

				window.showInformationMessage(ptext.content, { modal: true });
			},
			cancel: () => {
				if (progressWrapper.reject) {
					progressWrapper.reject();
				}

				statusBarItem.hide();
			}
		});
	});
}

function isTarget(fileName: string): boolean {
	const found = path.extname(fileName)
		.match(/(^\.md$|^\.markdown$|^\.mdown$|^\.mkd$|^\.mkdown$|^\.txt$)/);
	return found === null ? false : found.length >= 1;
}

export function deactivate() {}
