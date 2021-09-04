# <img src="https://raw.githubusercontent.com/seachicken/pomodoro-edit-core/master/.github/logo.png" align="right" width="100"> Pomodoro Edit for VSCode

Pomodoro Timer with the simplest text syntax.

![Demonstration](.github/demo.gif)

## Installation

Marketplace: https://marketplace.visualstudio.com/items?itemName=seitotanaka.vscode-pomodoro-edit

## Syntax

```md
* [ ] [p25 p5] xxx (single pomodoro 🍅)
* [ ] [(p25 p5)4] xxx (four pomodoros 🍅🍅🍅🍅) 
```

### Start timer

```md
* [ ] [(p25 p5)4] xxx (when after save, start timer)
```

### Finish timer

```md
* [x] [(p25 p5)4] xxx
```

### Pause timer

```md
* [ ] [-(p25 p5)4] xxx
```

### Retry timer

```md
* [ ] [(p25 p5)4] xxx. (when after enter dots and save, retry timer)
```

## Tips

If multiple timers are required, pause the next timer beforehand so that the timer does not start unintentionally.

```md
* [x] [(p25 p5)4] xxx
* [ ] [-(p25 p5)4] yyy
* [ ] [-(p25 p5)4] zzz
```

## Add-ons

You can get desktop notifications [here](https://chrome.google.com/webstore/detail/pomodoro-edit/mijjbmjlpkgjjpfkekdjgnkemlcfpcpo).
You can get e-mail notifications [here](https://github.com/seachicken/pomodoro-edit-notifier)
