export class UnexpectedError extends Error {
  constructor () {
    super('Ocorreu um erro no servidor. Tente novamente em breve')
    this.name = 'UnexpectedError'
  }
}
