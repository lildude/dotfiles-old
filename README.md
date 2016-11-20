# lildude's dotfiles

These are my dotfiles.  I've borrowed many ideas from many different locations to create my ideal setup.

# Instructions

```
git clone --recursive git@github.com:lildude/dotfiles.git .dotfiles
cd .dotfiles
script/bootstrap
```

---

# ANO Notes

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
apm list --installed --bare > ~/.atom/package-list.txt
```

Running `.dotfiles/bin/dot` will also update this list.
