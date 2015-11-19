#!/usr/bin/env coffee

cheerio = require 'cheerio'

module.exports = (content, opts) ->
  $ = cheerio.load(content)

  opts ||= {}

  options =
    disabled: false

  for key of opts
    options[key] = opts[key]

  render_item_checkbox = (html, checked, disabled) ->
    label = html[3..html.length - 1]

    """
      <label>
        <input type="checkbox"
        class="task-list-item-checkbox"
        #{checked}
        #{disabled}/>
        #{label}
      </label>
    """

  list_iterator = (item) ->
    srcHtml = $(item).clone().children().remove('il, ul').end().html()
    disabled = if options.disabled then "disabled" else ""
    detached = $(item).children('il, ul')

    if /^\[x\]/.test(srcHtml)
      $(item).html(render_item_checkbox(srcHtml, "checked", disabled)).append(detached)
    else if /^\[ \]/.test(srcHtml)
      $(item).html(render_item_checkbox(srcHtml, "", disabled)).append(detached)

  listItems = $('li')

  for item in listItems by 1
    child = $(item).children().first()['0']
    list_iterator(item)

    if child
      if child.name == "p"
        list_iterator(child)

  $.html()
