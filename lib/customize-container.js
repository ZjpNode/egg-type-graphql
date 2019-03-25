/**
 * Container to be used by this library for inversion control.
 * If container was not implicitly set then by default
 * container simply creates a new instance of the given class.
 */

class DefaultContainer {
  constructor() {
    this.instances = []
  }
  get(someClass, resolverData) {
    let instance = this.instances.find(it => it.type === someClass)
    if (!instance) {
      instance = { type: someClass, object: new someClass(resolverData) }
      this.instances.push(instance)
    }
    return instance.object
  }
}
class IOCContainer {
  constructor(iocContainerOrContainerGetter) {
    this.defaultContainer = new DefaultContainer()
    if (
      iocContainerOrContainerGetter &&
      'get' in iocContainerOrContainerGetter &&
      typeof iocContainerOrContainerGetter.get === 'function'
    ) {
      this.container = iocContainerOrContainerGetter
    } else if (typeof iocContainerOrContainerGetter === 'function') {
      this.containerGetter = iocContainerOrContainerGetter
    }
  }
  getInstance(someClass, resolverData) {
    const container = this.containerGetter
      ? this.containerGetter(resolverData)
      : this.container

    if (!container) {
      return this.defaultContainer.get(someClass, resolverData)
    }
    return container.get(someClass, resolverData)
  }
}
exports.IOCContainer = IOCContainer
