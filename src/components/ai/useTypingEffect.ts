import { useState, useEffect } from 'react'

type Options = {
  charDelay?: number
  startDelay?: number
}

export function useTypingEffect(fullText: string, options: Options = {}): string {
  const { charDelay = 18, startDelay = 800 } = options
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    setDisplayed('')
    if (!fullText) return

    const startTimer = setTimeout(() => {
      let index = 0
      const interval = setInterval(() => {
        index++
        setDisplayed(fullText.slice(0, index))
        if (index >= fullText.length) clearInterval(interval)
      }, charDelay)
      return () => clearInterval(interval)
    }, startDelay)

    return () => clearTimeout(startTimer)
  }, [fullText, charDelay, startDelay])

  return displayed
}
