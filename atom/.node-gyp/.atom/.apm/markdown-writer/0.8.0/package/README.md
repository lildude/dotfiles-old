# Markdown-Writer for Atom

Make [Atom](https://atom.io/) a better Markdown editor for blogs. Work great with [Jekyll](http://jekyllrb.com/), [Octopress](http://octopress.org/), [Hexo](http://hexo.io/) and other static blog engines.

![Insert Image](http://i.imgur.com/s9ekMns.gif)

More GIFs Here:

- [Create New Post](http://i.imgur.com/BwntxhB.gif)
- [Insert Reference Link](http://i.imgur.com/L67TqyF.gif)
- [Remove Reference Link](http://i.imgur.com/TglzeJV.gif)

## Features

- Dialog to **create new post** with front matter.
  - In Command Palette (`shift-cmd-P`), type `Markdown Writer: New Post`.
- Dialog to **create new draft** with front matter.
  - In Command Palette (`shift-cmd-P`), type `Markdown Writer: New Draft`.
- **Publish draft** moves current file to `_posts` directory.
  - It Updates `date` and rename the filename using `title` in front matter (if enabled).
  - In Command Palette (`shift-cmd-P`), type `Markdown Writer: Publish Draft`.
- Dialog to **manage tags and categories in front matter** (configurations required).
  - In Command Palette (`shift-cmd-P`), type `Markdown Writer: Manage Post Tags/Categories`
- Dialog to **insert link** (`shift-cmd-k`) and **automatically link to the text next time** (My favorite feature from Windows Live Writer).
  - Insert inline link by default
  - Insert reference link if title is specified. To insert with an empty title, enter `-` in title field.
  - Remove link (and its reference) after URL is deleted
  - Search published posts' links by title (configurations required)
- Dialog to **insert image** (`shift-cmd-i`) and with height and width auto-detected.
  - In Command Palette (`shift-cmd-P`), type `Markdown Writer: Insert Image`
- Dialog to **insert table** and with commands to jump cell and format table.
  - In Command Palette (`shift-cmd-P`), type `Markdown Writer: Insert Table`
- **Continue markdown lists** when you press `enter`.
- **Toggle text styles**:
  - `code` (`cmd-'`)
  - **bold** (`cmd-b`)
  - _italic_ (`cmd-i`)
  - ~~strikethrough~~ (`cmd-h`)
  - `'''codeblock'''` (`shift-cmd-"`)
  - `<kbd>key</kbd>` (`cmd + k`)
  - `- unordered list` (`shift-cmd-U`)
  - `0. ordered list` (`shift-cmd-O`)
  - `> blockquote` (`shift-cmd->`)
  - `- [ ] task list` (`markdown-writer:toggle-task`)
- **Toggle headings**: `ctrl-alt-[1-5]` to switch among `H1` to `H5`.
- **Helper commands**: you can add custom key mappings or search them in Command Palette (`shift-cmd-P`).
  - Jump to previous heading (`cmd-j cmd-p`)
  - Jump to next heading (`cmd-j cmd-n`)
  - Jump to next tabel cell (`cmd-j cmd-t`)
  - Jump between reference marker and definition (`cmd-j cmd-d`)
  - Format selected table with equal width (`markdown-writer:format-table`)
- **Markdown cheat sheet**.
  - In Command Palette (`shift-cmd-P`), type `Markdown Writer: Open Cheat Sheet`.

## Setup

You need to configure markdown-writer to use some of the features.

Go to `Preferences` (`cmd-,`), search `markdown writer` package.

### Settings Explained:

- **siteLocalDir**: The root directory of blog.
- **siteDraftsDir**: The directory of drafts from the root of `siteLocalDir`. Default is `_draft/`.
- **sitePostsDir**: The directory of posts from the root of `siteLocalDir`. Default is `_posts/{year}`. You can also use `{year}`, `{month}` and `{day}`.
- **newPostFileName**: The filename format of new posts created. Default is `{year}-{month}-{day}-{title}{extension}`.
- **fileExtension**: The file extension of posts/drafts. Default is `.markdown`.
- **urlForTags**: The URL to tags `JSON` file. Refer to next section.
- **urlForPosts**: The URL to posts `JSON` file. Refer to next section.
- **urlForCategories**: The URL to categories `JSON` file. Refer to next section.

### Advance Settings:

To change these settings, open your Atom Config file, find `markdown-writer` entry.

- **siteLinkPath**: Define path (string) to a `.cson` file that stores all links added for automatic linking next time.
  Default uses `markdown-writer-links.cson` in Atom's config directory.
- **frontMatter**: Define front matter (string) used when create new post/draft.
- **publishRenameBasedOnTitle**: Determine whether publish rename filename based on title in front matter. Default is `false` (boolean).
- **publishKeepFileExtname**: Determine whether publish keep draft's extname used. Default is `false` (boolean).
- **codeblock**: Define fenced code block (object). Default uses GitHub's fenced code block.
- **imageTag**: Define image tag inserted (string). Default uses `![alt](img-url)`.

This is an example of advance setting's configuration:

```coffee
'markdown-writer':
  # sync the links in dropbox
  'siteLinkPath': '/Users/zhuochun/Dropbox/blog/links.cson'
  # use Hexo front matter format
  'frontMatter': """
  layout: <layout>
  title: "<title>"
  date: "<date>"
  ---
  """
  # use jekyll highlight code block
  # change this requires reload Atom, shift-cmd-P -> Window Reload
  'codeblock':
    'before': '{% highlight %}\n'
    'after': '\n{% endhighlight %}'
    'regexBefore': '{% highlight(?: .+)? %}\n'
    'regexAfter': '\n{% endhighlight %}'
  # use img html tag
  'imageTag': '<img alt="<alt>" src="<src>" width="<width>" height="<height>" />'
```

## Populate Tags/Categories/Posts

![Manage Tags](http://i.imgur.com/amt2m0Y.png)

To **manage tags/categories in front matter** or **search published posts when inserting links**, you need to provide `JSON` files that contains tags/categories/posts in your blog.

The `JSON` files contain following information of your blog:

```json
{
  "tags": ["tag a", "tag b", "..."],
  "categories": ["category a", "category b", "..."],
  "posts": [{"title": "post a", "url": "url/to/post/a"}]
}
```

For **Jekyll** users, you can add [these scripts](https://gist.github.com/zhuochun/fe127356bcf8c07ae1fb) to your Jekyll directory and upload the generated `JSON` files.

For **Hexo** users, you can install [hexo-generator-atom-markdown-writer-meta](https://github.com/timnew/hexo-generator-atom-markdown-writer-meta) (Thanks to [@timnew](https://github.com/timnew)).

## FAQs

#### How to disable default key mappings, e.g. `ctrl-alt-[1-5]`?

Go to `Atom -> Open your Keymap`, paste the following:

```coffee
'.platform-darwin .editor':
  'ctrl-alt-1': 'unset!'
  'ctrl-alt-2': 'unset!'
  'ctrl-alt-3': 'unset!'
  'ctrl-alt-4': 'unset!'
  'ctrl-alt-5': 'unset!'
```

Default mappings can be found in [keymaps/md.cson](https://github.com/zhuochun/md-writer/blob/master/keymaps/md.cson).

A list of all commands can be found [here](https://github.com/zhuochun/md-writer/blob/master/package.json).

## TODOs

- Support multiple blog directories
- Support default settings for different engines

## Project

- View [CHANGELOG](https://github.com/zhuochun/md-writer/blob/master/CHANGELOG.md) :notebook_with_decorative_cover:.
- If you found any bug, please submit an issue [here](https://github.com/zhuochun/md-writer/issues) :octocat:.
- License in [MIT](https://github.com/zhuochun/md-writer/blob/master/LICENSE.md) :unlock:.
- Supported by [褪墨・时间管理](http://www.mifengtd.cn/) :clap:.

## Tips

- A theme targets on Markdown: Copy [this Gist](https://gist.github.com/zhuochun/b3659bcea98fca56cb43) to your Stylesheet.
- Jumping among your posts: `Cmd-t` or `Cmd-p`.
- Markdown Preview: [markdown-preview](https://atom.io/packages/markdown-preview) package.
