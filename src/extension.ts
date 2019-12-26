import * as vscode from 'vscode';
import { Duration } from 'luxon';
import Core from 'pomodoro-edit-core';

export function activate(context: vscode.ExtensionContext) {
	const core = new Core();
	const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	context.subscriptions.push(statusBarItem);

	vscode.workspace.onDidSaveTextDocument(document => {
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

export function deactivate() {}
