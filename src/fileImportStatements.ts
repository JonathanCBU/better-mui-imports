import * as vscode from 'vscode'
import { ImportStatement } from './types/importTypes'

// Regular expressions for detecting different types of imports
const defaultImportRegex = /import\s+([A-Za-z0-9_$]+)\s+from\s+['"]([^'"]+)['"]/
const namedImportRegex = /import\s+{\s*([^}]+)\s*}\s+from\s+['"]([^'"]+)['"]/
const namespaceImportRegex = /import\s+\*\s+as\s+([A-Za-z0-9_$]+)\s+from\s+['"]([^'"]+)['"]/
const mixedImportRegex = /import\s+([A-Za-z0-9_$]+)\s*,\s*{\s*([^}]+)\s*}\s+from\s+['"]([^'"]+)['"]/

const analyzeLine = (line: string, lineNumber: number): ImportStatement | null => {
  const defaultMatch = line.match(defaultImportRegex)
  if (defaultMatch) {
    return {
      raw: line,
      lineNumber,
      importType: 'default',
      moduleName: defaultMatch[2],
      importNames: [defaultMatch[1]],
    }
  }

  const namedMatch = line.match(namedImportRegex)
  if (namedMatch) {
    // split named imports by comma and trim whitespace
    const namedImports = namedMatch[1]
      .split(',')
      .map((imp) => imp.trim())
      .filter((imp) => imp.length > 0)

    return {
      raw: line,
      lineNumber,
      importType: 'named',
      moduleName: namedMatch[2],
      importNames: [...namedImports],
    }
  }

  const namespaceMatch = line.match(namespaceImportRegex)
  if (namespaceMatch) {
    return {
      raw: line,
      lineNumber,
      importType: 'namespace',
      moduleName: namespaceMatch[2],
      importNames: [namespaceMatch[1]],
    }
  }

  const mixedMatch = line.match(mixedImportRegex)
  if (mixedMatch) {
    return {
      raw: line,
      lineNumber,
      importType: 'mixed',
      moduleName: mixedMatch[3],
      importNames: [mixedMatch[1], mixedMatch[2]],
    }
  }

  return null
}

const analyzeDocument = (document: vscode.TextDocument): ImportStatement[] => {
  const imports: ImportStatement[] = []
  const lineCount = document.lineCount

  for (let num = 0; num < lineCount; num++) {
    const line = document.lineAt(num)
    const importStatement = analyzeLine(line.text, num)

    if (importStatement) {
      imports.push(importStatement)
    }
  }

  return imports
}

export default analyzeDocument
