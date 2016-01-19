# lildude's dotfiles

These are my dotfiles.  I've borrowed many ideas from many different locations to create my ideal setup.

## Contents

* script/bootstrap -
* private - this is a submodule to my private dotfiles stored in a private repo
* todo - config file for [todo.txt](http://todotxt.com/)
* vim - vim config files
* atom - [atom](http://atom.io) config files.

# Instructions

```
git clone --recusive git@github.com:lildude/dotfiles.git .dotfiles
cd .dotfiles
script/bootstrap
```

## Atom
### Prerequisites

- You have [Atom](https://atom.io/) installed :rocket:
- You have [apm](https://github.com/atom/apm) installed  
  Run *Atom > Install Shell Commands* from the menu option

### Instructions

Note: This will wipe out any existing Atom configurations that you have.

Install the Atom packages by running:

```
apm install --packages-file ~/.atom/package-list.txt
```

If you add or update an Atom package, update the `package-list.txt` file:

```
apm list --installed --bare | egrep -v "language-coffee-script|metrics" > ~/.atom/package-list.txt
```

We deliberately exclude `language-coffee-script` and `metrics` as they're bundled with Atom.
