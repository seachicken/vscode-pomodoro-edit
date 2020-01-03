import * as vscode from 'vscode';
import * as path from 'path';
import { Duration } from 'luxon';
import Core from 'pomodoro-edit-core';

export function activate(context: vscode.ExtensionContext) {
	const core = new Core();
	const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	context.subscriptions.push(statusBarItem);

	vscode.workspace.onDidSaveTextDocument(document => {
		if (!isTarget(document.fileName)) {
			return;
		}

		core.findAndCountPomodoroText(document.getText(), {
			interval: time => {
				statusBarItem.text = `$(clock) ${Duration.fromMillis(time * 1000).toFormat('mm:ss')}`;
				statusBarItem.show();
			},
			finish: ptext =>
				  vscode.window.showInformationMessage(ptext.content, { modal: true }),
			stop: () => statusBarItem.hide()
		});
	});
}

function isTarget(fileName: string): boolean {
	const found = path.extname(fileName)
		.match(/(^\.md$|^\.markdown$|^\.mdown$|^\.mkd$|^\.mkdown$|^\.txt$)/);
	return found === null ? false : found.length >= 1;
}

export function deactivate() {}
