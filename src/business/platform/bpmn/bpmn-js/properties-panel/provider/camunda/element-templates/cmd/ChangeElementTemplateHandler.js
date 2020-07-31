'use strict'

var findExtension = require('../Helper').findExtension
var findExtensions = require('../Helper').findExtensions

var createCamundaProperty = require('../CreateHelper').createCamundaProperty
var createInputParameter = require('../CreateHelper').createInputParameter
var createOutputParameter = require('../CreateHelper').createOutputParameter
var createCamundaIn = require('../CreateHelper').createCamundaIn
var createCamundaOut = require('../CreateHelper').createCamundaOut
var createCamundaInWithBusinessKey = require('../CreateHelper').createCamundaInWithBusinessKey
var createCamundaExecutionListenerScript = require('../CreateHelper').createCamundaExecutionListenerScript
var createCamundaFieldInjection = require('../CreateHelper').createCamundaFieldInjection

var forEach = require('lodash/forEach')

var CAMUNDA_SERVICE_TASK_LIKE = [
  'camunda:class',
  'camunda:delegateExpression',
  'camunda:expression'
]

/**
 * A handler that changes the modeling template of a BPMN element.
 */
function ChangeElementTemplateHandler(modeling, commandStack, bpmnFactory) {
  function getOrCreateExtensionElements(element) {
    var bo = element.businessObject

    var extensionElements = bo.extensionElements

    // add extension elements
    if (!extensionElements) {
      extensionElements = bpmnFactory.create('bpmn:ExtensionElements', {
        values: []
      })

      modeling.updateProperties(element, {
        extensionElements: extensionElements
      })
    }

    return extensionElements
  }

  function updateModelerTemplate(element, newTemplate) {
    modeling.updateProperties(element, {
      'camunda:modelerTemplate': newTemplate && newTemplate.id
    })
  }

  function updateIoMappings(element, newTemplate, context) {
    var newMappings = createInputOutputMappings(newTemplate, bpmnFactory)
    var oldMappings

    if (!newMappings) {
      return
    }

    if (context) {
      commandStack.execute('properties-panel.update-businessobject', {
        element: element,
        businessObject: context,
        properties: { inputOutput: newMappings }
      })
    } else {
      context = getOrCreateExtensionElements(element)
      oldMappings = findExtension(element, 'camunda:InputOutput')
      commandStack.execute('properties-panel.update-businessobject-list', {
        element: element,
        currentObject: context,
        propertyName: 'values',
        objectsToAdd: [newMappings],
        objectsToRemove: oldMappings ? [oldMappings] : []
      })
    }
  }

  function updateCamundaField(element, newTemplate, context) {
    var newMappings = createCamundaFieldInjections(newTemplate, bpmnFactory)
    var oldMappings

    if (!newMappings) {
      return
    }
    if (context) {
      commandStack.execute('properties-panel.update-businessobject', {
        element: element,
        businessObject: context,
        properties: { field: newMappings }
      })
    } else {
      context = getOrCreateExtensionElements(element)
      oldMappings = findExtensions(element, ['camunda:Field'])

      commandStack.execute('properties-panel.update-businessobject-list', {
        element: element,
        currentObject: context,
        propertyName: 'values',
        objectsToAdd: newMappings,
        objectsToRemove: oldMappings || []
      })
    }
  }

  function updateCamundaProperties(element, newTemplate, context) {
    var newProperties = createCamundaProperties(newTemplate, bpmnFactory)
    var oldProperties

    if (!newProperties) {
      return
    }

    if (context) {
      commandStack.execute('properties-panel.update-businessobject', {
        element: element,
        businessObject: context,
        properties: { properties: newProperties }
      })
    } else {
      context = getOrCreateExtensionElements(element)
      oldProperties = findExtension(element, 'camunda:Properties')

      commandStack.execute('properties-panel.update-businessobject-list', {
        element: element,
        currentObject: context,
        propertyName: 'values',
        objectsToAdd: [newProperties],
        objectsToRemove: oldProperties ? [oldProperties] : []
      })
    }
  }

  function updateProperties(element, newTemplate, context) {
    var newProperties = createBpmnPropertyUpdates(newTemplate, bpmnFactory)

    var newPropertiesCount = Object.keys(newProperties).length

    if (!newPropertiesCount) {
      return
    }

    if (context) {
      commandStack.execute('properties-panel.update-businessobject', {
        element: element,
        businessObject: context,
        properties: newProperties
      })
    } else {
      modeling.updateProperties(element, newProperties)
    }
  }

  function updateInOut(element, newTemplate, context) {
    var newInOut = createCamundaInOut(newTemplate, bpmnFactory)
    var oldInOut

    if (!newInOut) {
      return
    }

    if (context) {
      commandStack.execute('properties-panel.update-businessobject', {
        element: element,
        businessObject: context,
        properties: { inout: newInOut }
      })
    } else {
      context = getOrCreateExtensionElements(element)
      oldInOut = findExtensions(context, ['camunda:In', 'camunda:Out'])

      commandStack.execute('properties-panel.update-businessobject-list', {
        element: element,
        currentObject: context,
        propertyName: 'values',
        objectsToAdd: newInOut,
        objectsToRemove: oldInOut
      })
    }
  }

  function updateExecutionListener(element, newTemplate, context) {
    var newExecutionListeners = createCamundaExecutionListeners(newTemplate, bpmnFactory)
    var oldExecutionsListeners

    if (!newExecutionListeners.length) {
      return
    }

    if (context) {
      commandStack.execute('properties-panel.update-businessobject', {
        element: element,
        businessObject: context,
        properties: { executionListener: newExecutionListeners }
      })
    } else {
      context = getOrCreateExtensionElements(element)
      oldExecutionsListeners = findExtensions(context, ['camunda:ExecutionListener'])

      commandStack.execute('properties-panel.update-businessobject-list', {
        element: element,
        currentObject: context,
        propertyName: 'values',
        objectsToAdd: newExecutionListeners,
        objectsToRemove: oldExecutionsListeners
      })
    }
  }

  /**
   * Update / recreate a scoped element.
   *
   * @param {djs.model.Base} element the diagram parent element
   * @param {String} scopeName name of the scope, i.e. camunda:Connector
   * @param {Object} scopeDefinition
   */
  function updateScopeElements(element, scopeName, scopeDefinition) {
    var scopeElement = bpmnFactory.create(scopeName)

    // update camunda:inputOutput
    updateIoMappings(element, scopeDefinition, scopeElement)

    // update camunda:field
    updateCamundaField(element, scopeDefinition, scopeElement)

    // update camunda:properties
    updateCamundaProperties(element, scopeDefinition, scopeElement)

    // update other properties (bpmn:condition, camunda:async, ...)
    updateProperties(element, scopeDefinition, scopeElement)

    // update camunda:in and camunda:out
    updateInOut(element, scopeDefinition, scopeElement)

    // update camunda:executionListener
    updateExecutionListener(element, scopeDefinition, scopeElement)

    var extensionElements = getOrCreateExtensionElements(element)
    var oldScope = findExtension(extensionElements, scopeName)

    commandStack.execute('properties-panel.update-businessobject-list', {
      element: element,
      currentObject: extensionElements,
      propertyName: 'values',
      objectsToAdd: [scopeElement],
      objectsToRemove: oldScope ? [oldScope] : []
    })
  }

  /**
   * Compose an element template change action, updating all
   * necessary underlying properties.
   *
   * @param {Object} context
   * @param {Object} context.element
   * @param {Object} context.oldTemplate
   * @param {Object} context.newTemplate
   */
  this.preExecute = function(context) {
    var element = context.element
    var newTemplate = context.newTemplate

    // update camunda:modelerTemplate attribute
    updateModelerTemplate(element, newTemplate)

    if (newTemplate) {
      // update camunda:inputOutput
      updateIoMappings(element, newTemplate)

      // update camunda:field
      updateCamundaField(element, newTemplate)

      // update camunda:properties
      updateCamundaProperties(element, newTemplate)

      // update other properties (bpmn:condition, camunda:async, ...)
      updateProperties(element, newTemplate)

      // update camunda:in and camunda:out
      updateInOut(element, newTemplate)

      // update camunda:executionListener
      updateExecutionListener(element, newTemplate)

      // loop on scopes properties
      forEach(newTemplate.scopes, function(scopeDefinition, scopeName) {
        updateScopeElements(element, scopeName, scopeDefinition)
      })
    }
  }
}

ChangeElementTemplateHandler.$inject = ['modeling', 'commandStack', 'bpmnFactory']

module.exports = ChangeElementTemplateHandler

// helpers /////////////////////////////

function createBpmnPropertyUpdates(template, bpmnFactory) {
  var propertyUpdates = {}

  template.properties.forEach(function(p) {
    var binding = p.binding
    var bindingTarget = binding.name
    var propertyValue

    if (binding.type === 'property') {
      if (bindingTarget === 'conditionExpression') {
        propertyValue = bpmnFactory.create('bpmn:FormalExpression', {
          body: p.value,
          language: binding.scriptFormat
        })
      } else {
        propertyValue = p.value
      }

      // assigning camunda:async to true|false
      // assigning bpmn:conditionExpression to { $type: 'bpmn:FormalExpression', ... }
      propertyUpdates[bindingTarget] = propertyValue

      // make sure we unset other "implementation types"
      // when applying a camunda:class template onto a preconfigured
      // camunda:delegateExpression element
      if (CAMUNDA_SERVICE_TASK_LIKE.indexOf(bindingTarget) !== -1) {
        CAMUNDA_SERVICE_TASK_LIKE.forEach(function(prop) {
          if (prop !== bindingTarget) {
            propertyUpdates[prop] = undefined
          }
        })
      }
    }
  })

  return propertyUpdates
}

function createCamundaFieldInjections(template, bpmnFactory) {
  var injections = []

  template.properties.forEach(function(p) {
    var binding = p.binding
    var bindingType = binding.type
    if (bindingType === 'camunda:field') {
      injections.push(createCamundaFieldInjection(
        binding, p.value, bpmnFactory
      ))
    }
  })

  if (injections.length) {
    return injections
  }
}

function createCamundaProperties(template, bpmnFactory) {
  var properties = []

  template.properties.forEach(function(p) {
    var binding = p.binding
    var bindingType = binding.type

    if (bindingType === 'camunda:property') {
      properties.push(createCamundaProperty(
        binding, p.value, bpmnFactory
      ))
    }
  })

  if (properties.length) {
    return bpmnFactory.create('camunda:Properties', {
      values: properties
    })
  }
}

function createInputOutputMappings(template, bpmnFactory) {
  var inputParameters = []
  var outputParameters = []

  template.properties.forEach(function(p) {
    var binding = p.binding
    var bindingType = binding.type

    if (bindingType === 'camunda:inputParameter') {
      inputParameters.push(createInputParameter(
        binding, p.value, bpmnFactory
      ))
    }

    if (bindingType === 'camunda:outputParameter') {
      outputParameters.push(createOutputParameter(
        binding, p.value, bpmnFactory
      ))
    }
  })

  // do we need to create new ioMappings (?)
  if (outputParameters.length || inputParameters.length) {
    return bpmnFactory.create('camunda:InputOutput', {
      inputParameters: inputParameters,
      outputParameters: outputParameters
    })
  }
}

function createCamundaInOut(template, bpmnFactory) {
  var inOuts = []

  template.properties.forEach(function(p) {
    var binding = p.binding
    var bindingType = binding.type

    if (bindingType === 'camunda:in') {
      inOuts.push(createCamundaIn(
        binding, p.value, bpmnFactory
      ))
    } else
    if (bindingType === 'camunda:out') {
      inOuts.push(createCamundaOut(
        binding, p.value, bpmnFactory
      ))
    } else
    if (bindingType === 'camunda:in:businessKey') {
      inOuts.push(createCamundaInWithBusinessKey(
        binding, p.value, bpmnFactory
      ))
    }
  })

  return inOuts
}

function createCamundaExecutionListeners(template, bpmnFactory) {
  var executionListener = []

  template.properties.forEach(function(p) {
    var binding = p.binding
    var bindingType = binding.type

    if (bindingType === 'camunda:executionListener') {
      executionListener.push(createCamundaExecutionListenerScript(
        binding, p.value, bpmnFactory
      ))
    }
  })

  return executionListener
}
