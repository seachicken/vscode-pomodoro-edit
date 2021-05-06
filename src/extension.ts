import { ExtensionContext, workspace, ProgressLocation, window, Progress } from 'vscode';
import * as path from 'path';
import { Duration } from 'luxon';
import * as WebSocket from 'ws';
import Core from 'pomodoro-edit-core';

export function activate(context: ExtensionContext) {
	const core = new Core();

	const progressWrapper: {
		progress?: Progress<{
			message?: string;
			increment?: number;
		}>,
		resolve?: () => void,
		reject?: () => void
	} = {};

	let socket: WebSocket;
	const wss = new WebSocket.Server({ port: 62115 });
	wss.on('connection', ws => socket = ws);

	workspace.onDidSaveTextDocument(document => {
		if (!isTarget(document.languageId)) {
			return;
		}

		core.findAndStartTimer(document.getText(), document.fileName, {
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
					const time = Duration.fromMillis(remaining * 1000).toFormat('m:ss');
					progressWrapper.progress.report({ increment: 100 / ptext.time, message: `${ptext.content} (${time})` });
				}
				if (socket && socket.readyState === WebSocket.OPEN) {
					const ptextWithType = {
						type: 'interval',
						remaining,
						...ptext
					};
					socket.send(JSON.stringify(ptextWithType));
				}
			},
			finish: ptext => {
				if (progressWrapper.resolve) {
					progressWrapper.resolve();
				}

				if (socket && socket.readyState === WebSocket.OPEN) {
					const ptextWithType = {
						type: 'finish',
						...ptext
					};
					socket.send(JSON.stringify(ptextWithType));
				} else {
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

export function deactivate() {}
