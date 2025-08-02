'use client'

import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { ToolbarPlugin } from './ToolbarPlugin'

const theme = {
  heading: {
    h1: 'text-3xl font-bold mb-2',
    h2: 'text-2xl font-semibold mb-2',
    h3: 'text-xl font-semibold mb-2',
  },
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
  },
  paragraph: 'mb-3',
}

export default function LexicalEditor({ value, onChange }) {
  const initialConfig = {
    namespace: 'BeritaEditor',
    theme,
    onError: (error) => console.error(error),
    editable: true,
  }

  return (
    <div className="border rounded-xl bg-white shadow p-4 space-y-3">
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <RichTextPlugin
          contentEditable={
            <div className="relative">
              <ContentEditable className="min-h-[200px] max-h-[500px] overflow-y-auto border border-gray-300 p-4 rounded-md text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#129990] prose max-w-none" />
            </div>
          }
        />
        <HistoryPlugin />
        <OnChangePlugin
          onChange={(editorState) => {
            editorState.read(() => {
              const json = editorState.toJSON()
              onChange(json)
            })
          }}
        />
      </LexicalComposer>
    </div>
  )
}
