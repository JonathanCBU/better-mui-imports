import * as vscode from 'vscode'
import betterMuiImports from './betterMuiImports'

export function activate(context: vscode.ExtensionContext) {
  const importFixesDisposable = vscode.commands.registerCommand('better-mui-imports.importFixes', () => {
    betterMuiImports()
  })

  context.subscriptions.push(importFixesDisposable)
}

export function deactivate() {}
