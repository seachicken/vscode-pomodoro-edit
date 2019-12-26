import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	vscode.workspace.onDidSaveTextDocument(document => {
		console.log("saved!");
	});
}

export function deactivate() {}
