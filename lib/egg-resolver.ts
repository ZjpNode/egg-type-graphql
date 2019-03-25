import { BaseContextClass } from 'egg'

export class EggResolver extends BaseContextClass {
  constructor(resolverData: any) {
    super(resolverData.context)
    this.ctx = resolverData.context
  }
}