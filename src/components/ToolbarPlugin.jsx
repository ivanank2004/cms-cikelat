'use client'

import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
} from 'lexical'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useEffect } from 'react'

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          // Bisa digunakan untuk menyimpan format aktif jika perlu
        }
      })
    })
  }, [editor])

  return (
    <div className="flex space-x-2 px-2 pb-2 border-b border-gray-300">
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        className="text-sm px-2 py-1 border rounded hover:bg-gray-100"
      >
        Bold
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        className="text-sm px-2 py-1 border rounded hover:bg-gray-100"
      >
        Italic
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
        className="text-sm px-2 py-1 border rounded hover:bg-gray-100"
      >
        Underline
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'ul')}
        className="text-sm px-2 py-1 border rounded hover:bg-gray-100"
      >
        Bullet
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'ol')}
        className="text-sm px-2 py-1 border rounded hover:bg-gray-100"
      >
        Number
      </button>
    </div>
  )
}
