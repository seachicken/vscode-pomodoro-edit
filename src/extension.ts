import * as vscode from 'vscode';
import Core from 'pomodoro-edit-core';

export function activate(context: vscode.ExtensionContext) {
	const core = new Core();
	vscode.workspace.onDidSaveTextDocument(document => {
		core.findAndCountPomodoroText(document.getText(), {
			interval: (time: number) => console.log(`interval time: ${time}`),
			finish: (ptext: any) =>
				  vscode.window.showInformationMessage(ptext.content, { modal: true }),
			stop: () => {}
		});
	});
}

export function deactivate() {}
