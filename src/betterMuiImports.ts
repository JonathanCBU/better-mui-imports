import analyzeDocument from './fileImportStatements'

import * as vscode from 'vscode'

const betterMuiImports = () => {
  const editor = vscode.window.activeTextEditor
  if (!editor) {
    vscode.window.showInformationMessage('No editor is active')
    return
  }
  const document = editor.document

  const imports = analyzeDocument(document)

  // Create a new output channel to display results
  const outputChannel = vscode.window.createOutputChannel('Import Analysis')
  outputChannel.show(true)

  imports.forEach((imp) => {
    if (imp.moduleName.includes('@mui')) {
      if (imp.importType === 'named') {
        outputChannel.appendLine(`Detected named MUI import of ${imp.importNames}. Consider using default import:`)
        imp.importNames.forEach((importName) => {
          outputChannel.appendLine(`\timport ${importName} from '${imp.moduleName}/${importName}'`)
        })
        outputChannel.appendLine('')
      }
    }
  })
}

export default betterMuiImports
