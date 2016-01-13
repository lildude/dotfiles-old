HEADING_REGEX   = /// ^\# {1,6} \ + .+$ ///g
TABLE_COL_REGEX = ///  ([^\|]*?) \s* \| ///
TABLE_VAL_REGEX = /// (?:^|\|) ([^\|]+) ///g
TABLE_LINE_SEPARATOR_REGEX = /// ^ (?:\|?) (?::?-+:?\|)+ (?::?-+:?) \|? $ ///

class Commands

  trigger: (command) ->
    fn = command.replace /-[a-z]/ig, (s) -> s[1].toUpperCase()
    @[fn]()

  jumpToPreviousHeading: ->
    editor = atom.workspace.getActiveEditor()
    {row} = editor.getCursorBufferPosition()

    @_executeMoveToPreviousHeading(editor, [[0, 0], [row - 1, 0]])

  _executeMoveToPreviousHeading: (editor, range) ->
    found = false
    editor.buffer.backwardsScanInRange HEADING_REGEX, range, (match) ->
      found = true
      editor.setCursorBufferPosition(match.range.start)
      match.stop()
    return found

  jumpToNextHeading: ->
    editor = atom.workspace.getActiveEditor()
    curPosition = editor.getCursorBufferPosition()
    eofPosition = editor.getEofBufferPosition()

    range = [
      [curPosition.row + 1, 0]
      [eofPosition.row + 1, 0]
    ]
    return if @_executeMoveToNextHeading(editor, range)

    # back to top
    @_executeMoveToNextHeading(editor, [[0, 0], [eofPosition.row + 1, 0]])

  _executeMoveToNextHeading: (editor, range) ->
    found = false
    editor.buffer.scanInRange HEADING_REGEX, range, (match) ->
      found = true
      editor.setCursorBufferPosition(match.range.start)
      match.stop()
    return found

  # jump between reference marker and reference definition
  jumpBetweenReferenceDefinition: ->
    editor = atom.workspace.getActiveEditor()
    cursor = editor.getCursorBufferPosition()
    key = editor.getSelectedText() || editor.getWordUnderCursor()
    key = /// \[? ([^\s\]]+) (?:\] | \]:)? ///.exec(key)[1]

    editor.buffer.scan /// \[ #{key} \] ///g, (match) ->
      end = match.range.end
      if end.row != cursor.row
        editor.setCursorBufferPosition([end.row, end.column - 1])
        match.stop()

  jumpToNextTableCell: ->
    editor = atom.workspace.getActiveEditor()
    {row, column} = editor.getCursorBufferPosition()
    line = editor.lineForBufferRow(row)
    cell = line.indexOf("|", column)

    if cell == -1
      row += 1
      line = editor.lineForBufferRow(row)

    if @_isTableLineSeparator(line)
      row += 1
      cell = -1
      line = editor.lineForBufferRow(row)

    cell = @_findNextTableCellIdx(line, cell + 1)
    editor.setCursorBufferPosition([row, cell])

  _isTableLineSeparator: (line) ->
    TABLE_LINE_SEPARATOR_REGEX.test(line)

  _findNextTableCellIdx: (line, column) ->
    if td = TABLE_COL_REGEX.exec(line[column..])
      column + td[1].length
    else
      line.length + 1

  formatTable: ->
    editor = atom.workspace.getActiveEditor()
    lines = editor.getSelectedText().split("\n")
    values = @_parseTable(lines)
    editor.insertText(@_createTable(values))

  _parseTable: (lines) ->
    table = []
    maxes = []

    lines.forEach (line, i) ->
      return if i == 1

      columns = line.split("|").map (col) -> col.trim()
      table.push(columns)

      columns.forEach (col, j) ->
        if maxes[j]?
          maxes[j] = col.length if col.length > maxes[j]
        else
          maxes[j] = col.length

    return table: table, maxes: maxes

  _createTable: ({table, maxes}) ->
    result = []

    # table head
    result.push @_createTableRow(table[0], maxes, " | ")
    # table head separators
    result.push maxes.map((n) -> '-'.repeat(n)).join("-|-")
    # table body
    table[1..].forEach (vals) =>
      result.push @_createTableRow(vals, maxes, " | ")

    return result.join("\n")

  _createTableRow: (vals, widths, separator) ->
    vals.map((val, i) -> "#{val}#{' '.repeat(widths[i] - val.length)}")
        .join(separator)
        .trimRight() # remove trailing spaces

  openCheatSheet: ->
    packageDir = atom.packages.getLoadedPackage("markdown-writer").path
    cheatsheet = require("path").join packageDir, "CHEATSHEET.md"

    atom.workspace.open "markdown-preview://#{encodeURI(cheatsheet)}",
      split: 'right', searchAllPanes: true

module.exports = new Commands()
