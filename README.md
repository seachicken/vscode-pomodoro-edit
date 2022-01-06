# <img src="https://raw.githubusercontent.com/seachicken/pomodoro-edit-core/master/.github/logo.png" align="right" width="100"> Pomodoro Edit for VSCode

Pomodoro Timer with the simplest text syntax.

![Demonstration](.github/demo.gif)

## Installation

Marketplace: https://marketplace.visualstudio.com/items?itemName=seitotanaka.vscode-pomodoro-edit

## Examples

```md
- [ ] [(25m✍️ 5m☕️)4] xxx (four pomodoros) 
- [ ] [((25m✍️ 5m☕️)4 20m🛌)] xxx (four pomodoros and then take a long break) 
- [ ] [25m] xxx (single timer)
```

[Syntax details](https://github.com/seachicken/pomodoro-edit-core#syntax)

💡Ctrl+Space: Autocomplete above syntax

### Start timer

```md
- [ ] [(25m 5m)4] xxx (when after save, start timer)
```

### Finish timer

```md
- [x] [(25m 5m)4] xxx
```

### Pause timer

```md
- [ ] [-(25m 5m)4] xxx
```

### Retry timer

```md
- [ ] [(25m 5m)4] xxx. (when after enter dots and save, retry timer)
```

## Tips

If multiple timers are required, pause the next timer beforehand so that the timer does not start unintentionally.

```md
- [x] [(25m 5m)4] xxx
- [ ] [-(25m 5m)4] yyy
- [ ] [-(25m 5m)4] zzz
```

## Add-ons

- Get desktop notifications: [Chrome Extension](https://chrome.google.com/webstore/detail/pomodoro-edit/mijjbmjlpkgjjpfkekdjgnkemlcfpcpo)
- Get e-mail notifications: [seachicken/pomodoro-edit-notifier](https://github.com/seachicken/pomodoro-edit-notifier)
