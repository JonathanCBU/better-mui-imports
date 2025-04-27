export interface ImportStatement {
  raw: string
  lineNumber: number
  importType: 'default' | 'named' | 'namespace' | 'mixed'
  moduleName: string
  importNames: string[]
}
