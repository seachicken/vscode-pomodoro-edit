# <img src="https://raw.githubusercontent.com/seachicken/pomodoro-edit-core/master/.github/logo.png" align="right" width="100"> Pomodoro Edit for VSCode

Pomodoro Timer with the simplest text syntax.

![Demonstration](.github/demo.gif)

## Installation

Marketplace: https://marketplace.visualstudio.com/items?itemName=seitotanaka.vscode-pomodoro-edit

## Syntax

```md
* [ ] [p25] xxx (supported unordered list bullet are '*' and '-')
  * [ ] [p25] xxx
```

### Start timer

```md
* [ ] [p25] xxx (when after save, start timer)
```

### Finish timer

```md
* [x] [p25] xxx
```

### Pause timer

```md
* [ ] [-p25] xxx
```

### Add extra time

```md
* [ ] [p25+5] xxx
```

## Tips

If multiple timers are required, pause the next timer beforehand so that the timer does not start unintentionally.

```md
* [x] [p25] xxx
* [ ] [-p25] yyy
* [ ] [-p25] zzz
```

## Add-ons

You can get desktop notifications [here](https://chrome.google.com/webstore/detail/pomodoro-edit/mijjbmjlpkgjjpfkekdjgnkemlcfpcpo).
