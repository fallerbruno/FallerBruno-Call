import { useState } from 'react'
import { CalendarStep } from './CalendarStep'
import { ConfirmStep } from './ConfirmStep'

export function SchedureForm() {
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null)

  if (selectedDateTime) {
    return (
      <ConfirmStep
        schedulingDate={selectedDateTime}
        onEndEvent={handleClearSelectedDateTime}
      />
    )
  }

  function handleClearSelectedDateTime() {
    setSelectedDateTime(null)
  }

  return (
    <>
      <CalendarStep onSelectDateTime={setSelectedDateTime} />
    </>
  )
}
