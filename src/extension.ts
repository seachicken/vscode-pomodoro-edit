import {
	ExtensionContext,
	workspace,
	ProgressLocation,
	window,
	Progress,
	languages,
	Position,
	CompletionItem,
	CompletionItemKind,
	SnippetString,
	Range,
	TextEdit
} from 'vscode';
import Core, { getReplacementRange } from '@seachicken/pomodoro-edit-core';

const SUPPORTED_LANGUAGE_IDS = ['markdown', 'plaintext'];

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

	context.subscriptions.push(languages.registerCompletionItemProvider(SUPPORTED_LANGUAGE_IDS, {
		provideCompletionItems(document, position) {
			const bullet: string =
				workspace.getConfiguration('markdown').get('extension.toc.unorderedList.marker') // if using yzhang.markdown-all-in-one
				|| '-';
			const { found, start, end } = getReplacementRange(
				document.lineAt(position.line).text, { line: position.line, ch: position.character }, bullet);

			const ptimer = new CompletionItem('Pomodoro Timer syntax', CompletionItemKind.Snippet);
			ptimer.detail = 'Multiple pomodoros';
			ptimer.documentation = `${bullet} [ ] [(25m✍️ 5m☕️)1] `;
			ptimer.insertText = new SnippetString(bullet + ' [ ] [$3(25m✍️ 5m☕️)${1|1,2,3,4|}] $2');
			if (found) {
				ptimer.additionalTextEdits = [
					TextEdit.delete(new Range(
						new Position(start.line, start.ch),
						new Position(end.line, end.ch)))
					];
			}

			const timer = new CompletionItem('Single timer syntax', CompletionItemKind.Snippet);
			timer.detail = 'Single timer';
			timer.documentation = `${bullet} [ ] [25m] `;
			timer.insertText = new SnippetString(bullet + ' [ ] [$3${1|25,20,15,10,5|}m] $2');
			if (found) {
				timer.additionalTextEdits = [
					TextEdit.delete(new Range(
						new Position(start.line, start.ch),
						new Position(end.line, end.ch)))
					];
			}

            return [ptimer, timer];
		}
	}));

	workspace.onDidSaveTextDocument(document => {
		if (!isSupported(document.languageId)) {
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
			interval: (remainingSec, durationSec, stepNos, symbol, ptext) => {
				if (progressWrapper.progress) {
					const displayTime = `${Math.floor(remainingSec / 60)}:${(remainingSec % 60).toString().padStart(2, '0')}`;
					const blank = symbol || stepNos ? ' ' : '';
					progressWrapper.progress.report({
						increment: 100 / durationSec,
						message: `${ptext.content} (${displayTime}${blank}${symbol || ''}${stepNos ? '#' + stepNos : ''})`
					});
				}
			},
			step: (stepNos, symbol, ptext) => {
				if (progressWrapper.progress) {
					progressWrapper.progress.report({ increment: -100, message: ptext.content });
				}

				if (!core.runningServer()) {
					const blank = symbol || stepNos ? ' ' : '';
					window.showInformationMessage(`🍅 Go to the next step\n${ptext.content}${blank}${symbol}${stepNos ? '#' + stepNos : ''}`, { modal: true });
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

function isSupported(languageId: string): boolean {
	// https://code.visualstudio.com/docs/languages/identifiers#_known-language-identifiers
	return SUPPORTED_LANGUAGE_IDS.some(id => id === languageId);
}

export function deactivate() {
	core.closeServer();
	core.stopTimer();
}
