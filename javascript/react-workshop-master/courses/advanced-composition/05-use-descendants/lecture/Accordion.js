import React, { useState, useContext, useRef, forwardRef } from 'react'
import { wrapEvent, useForkedRef } from '../../utils'
import { useId } from '../../useId'

// import {
//   createDescendantContext,
//   DescendantProvider,
//   useDescendant,
//   useDescendants
// } from '@reach/descendants'

// const DescendantContext = createDescendantContext('DescendantContext')
const AccordionContext = React.createContext()

/**
 * Accordion
 */

export const Accordion = forwardRef(
  (
    { children, onChange, index: controlledIndex, defaultIndex = 0, id, ...props },
    forwardedRef
  ) => {
    const [selectedIndex, setSelectedIndex] = useState(defaultIndex)
    const accordionId = useId(id)

    const isControlled = controlledIndex != null
    const { current: startsControlled } = useRef(isControlled)
    if (isControlled !== startsControlled) {
      console.warn('Cannot change from controlled to uncontrolled or vice versa.')
    }

    children = React.Children.map(children, (child, index) => {
      const panelId = `accordion-${accordionId}-panel-${index}`
      const buttonId = `accordion-${accordionId}-button-${index}`

      const context = {
        buttonId,
        panelId,
        selected: isControlled ? controlledIndex === index : selectedIndex === index,
        selectPanel: () => {
          onChange && onChange(index)
          if (!isControlled) {
            setSelectedIndex(index)
          }
        }
      }
      return <AccordionContext.Provider value={context} children={child} />
    })

    return (
      <div data-accordion="" ref={forwardedRef} {...props}>
        {children}
      </div>
    )
  }
)

Accordion.displayName = 'Accordion'

/**
 * Accordion Item
 */

export const AccordionItem = forwardRef(({ children, ...props }, forwardedRef) => {
  const { selected } = useContext(AccordionContext)

  return (
    <div
      {...props}
      data-accordion-item=""
      data-state={selected ? 'open' : 'collapsed'}
      ref={forwardedRef}
    >
      {children}
    </div>
  )
})

AccordionItem.displayName = 'AccordionItem'

/**
 * Accordion Button
 */

export const AccordionButton = forwardRef(
  ({ children, onClick, ...props }, forwardedRef) => {
    const { panelId, selected, selectPanel } = useContext(AccordionContext)

    return (
      <button
        {...props}
        onClick={wrapEvent(onClick, selectPanel)}
        data-accordion-button=""
        data-state={selected ? 'open' : 'collapsed'}
        aria-expanded={selected}
        aria-controls={panelId}
        ref={forwardedRef}
      >
        {children}
      </button>
    )
  }
)

AccordionButton.displayName = 'AccordionButton'

/**
 * Accordion Panel
 */

export const AccordionPanel = forwardRef(({ children, ...props }, forwardedRef) => {
  const { buttonId, panelId, selected } = useContext(AccordionContext)

  return (
    <div
      role="region"
      {...props}
      id={panelId}
      aria-labelledby={buttonId}
      hidden={!selected}
      data-accordion-panel=""
      data-state={selected ? 'open' : 'collapsed'}
      ref={forwardedRef}
    >
      {children}
    </div>
  )
})

AccordionPanel.displayName = 'AccordionPanel'
