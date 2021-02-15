interface ParserState<T = any> {
  targetString: string
  index: number
  result: T|null
  isError: boolean
  error: string|null
}

type ParserFn = (ParserState: ParserState) => ParserState

const updateParserState = (state: ParserState, index: number, result: string) => ({
  ...state,
  index,
  result
})

const updateParserError = (state: ParserState, errorMsg: string) => ({
  ...state,
  isError: true,
  error: errorMsg
})

const updateParserResult = (state: ParserState, result: string) => ({
  ...state,
  result
})

const Parser = (parserStateTransformerFn: (state: ParserState) => ParserState): Parser => {
  return Object.assign(parserStateTransformerFn, {
    run (targetString: string) {
      const initialState = {
        targetString,
        index: 0,
        result: null,
        isError: false,
        error: null
      }
    
      return parserStateTransformerFn(initialState)
    },

    map (fn: (result: string) => any) {
      return Parser.of(parserState => {
        const nextState = parserStateTransformerFn(parserState)

        if (nextState.isError) return nextState

        return updateParserResult(nextState, fn(nextState.result))
      })
    },

    errorMap (fn: (result: string, index: number) => string) {
      return Parser.of(parserState => {
        const nextState = parserStateTransformerFn(parserState)

        if (!nextState.isError) return nextState

        return updateParserError(nextState, fn(nextState.error, nextState.index))
      })
    },

    chain (fn: (result: string) => any) {
      return Parser.of(parserState => {
        const nextState = parserStateTransformerFn(parserState)

        if (nextState.isError) return nextState

        const nextParser = fn(nextState.result)
        return nextParser(nextState)
      })
    },
  })
}

Parser.of = Parser

const str = (s: string) => Parser((parserState: ParserState) => {
  const {
    targetString,
    index,
    isError
  } = parserState

  if (isError) {
    return parserState
  }

  const slicedTarget = targetString.slice(index)

  if (slicedTarget.length === 0) {
    return updateParserError(
      parserState,
      `Tried to match "${s}", but got unexpected end of input.`
    )
  }

  if (slicedTarget.startsWith(s)) {
    return updateParserState(parserState, index + s.length, s)
  }

  return updateParserError(
    parserState, 
    `Tried to match "${s}", but got "${targetString.slice(index, index + 10)}"`
  )
})

const lettersRegex = /[A-Za-z]+/
const letters = Parser((parserState: ParserState) => {
  const {
    targetString,
    index,
    isError
  } = parserState

  if (isError) {
    return parserState
  }

  const slicedTarget = targetString.slice(index)

  if (slicedTarget.length === 0) {
    return updateParserError(
      parserState,
      `letters: Got unexpected end of input.`
    )
  }

  const regexMatch = slicedTarget.match(lettersRegex)

  if (regexMatch) {
    return updateParserState(parserState, index + regexMatch[0].length, regexMatch[0])
  }

  return updateParserError(
    parserState, 
    `letters: Couldn't match letters at index ${index}"`
  )
})

const digitsRegex = /^[0-9]+/
const digits = Parser((parserState: ParserState) => {
  const {
    targetString,
    index,
    isError
  } = parserState

  if (isError) {
    return parserState
  }

  const slicedTarget = targetString.slice(index)

  if (slicedTarget.length === 0) {
    return updateParserError(
      parserState,
      `letters: Got unexpected end of input.`
    )
  }

  const regexMatch = slicedTarget.match(digitsRegex)

  if (regexMatch) {
    return updateParserState(parserState, index + regexMatch[0].length, regexMatch[0])
  }

  return updateParserError(
    parserState, 
    `letters: Couldn't match letters at index ${index}"`
  )
})

interface ParserUtils {
  run (targetString: string): ParserState
  map (f: (result: any) => any): Parser
  errorMap (f: (result: any, index: number) => any): Parser
  chain (f: (result: any) => Parser)
}

type Parser = ParserFn & ParserUtils

const sequenceOf = (parsers: Parser[]) => Parser((parserState: ParserState) => {
  if (parserState.isError) {
    return parserState
  }

  const results = []

  let nextState = parserState

  for (let parser of parsers) {
    nextState = parser(nextState)
    results.push(nextState.result)
  }

  return updateParserResult(nextState, results as unknown as string)
})

const choice = (parsers: Parser[]) => Parser((parserState: ParserState) => {
  if (parserState.isError) {
    return parserState
  }
  
  let nextState: ParserState

  for (let parser of parsers) {
    nextState = parser(parserState)
    if (!nextState.isError) {
      return nextState
    }
  }


  return updateParserError(
    parserState, 
    `choice: Unable to match any parser at index ${parserState.index}`
  )
})

const many = (parser: Parser) => Parser((parserState: ParserState) => {
  if (parserState.isError) {
    return parserState
  }
  
  let nextState = parserState
  const results = []
  let done = false

  while (!done) {
    let testState = parser(nextState)
    if (!testState.isError) {
      results.push(testState.result)
      nextState = testState
    } else {
      done = true
    }
  }

  return updateParserResult(nextState, results as unknown as string)
})

const many1 = (parser: Parser) => Parser((parserState: ParserState) => {
  if (parserState.isError) {
    return parserState
  }
  
  let nextState = parserState
  const results = []
  let done = false

  while (!done) {
    let testState = parser(nextState)
    if (!testState.isError) {
      results.push(testState.result)
      nextState = testState
    } else {
      done = true
    }
  }

  if (results.length === 0) {
    return updateParserError(
      parserState,
      `many1: Unable to match any input using parser @ index ${parserState.index}`
    )
  }

  return updateParserResult(nextState, results as unknown as string)
})

const between = (leftParser: Parser, rightParser: Parser) => (contentParser: Parser) => sequenceOf([
  leftParser,
  contentParser,
  rightParser
]).map(results => results[1])

const sepBy = (separatorParser: Parser) => (valueParser: Parser) => Parser(parserState => {
  const results = []

  let nextState = parserState

  while (true) {
    const thingWeWantState = valueParser(nextState)

    if (thingWeWantState.isError) {
      break
    }

    results.push(thingWeWantState.result)
    nextState = thingWeWantState

    const separatorState = separatorParser(nextState)
    if (separatorState.isError) {
      break
    }

    nextState = separatorState
  }

  return updateParserResult(nextState, results as unknown as string)
})

const sepBy1 = (separatorParser: Parser) => (valueParser: Parser) => Parser(parserState => {
  const results = []
  let nextState = parserState

  while (true) {
    const thingWeWantState = valueParser(nextState)
    if (thingWeWantState.isError) {
      break
    }

    results.push(thingWeWantState.result)
    nextState = thingWeWantState

    const separatorState = separatorParser(nextState)
    if (separatorState.isError) {
      break
    }

    nextState = separatorState
  }

  if (results.length === 0) {
    return updateParserError(
      parserState,
      `sepBy1: Unable to capture any results at index ${parserState.index}`
    )
  }

  return updateParserResult(nextState, results as unknown as string)
})

const lazy = (parserThunk: () => Parser) => Parser(parserState => {
  const parser = parserThunk()
  return parser(parserState)
})

const betweenSquareBrackets = between(str('['), str(']'))
const commaSeparated = sepBy(str(','))

const value = lazy(() => choice([
  digits.map(Number),
  arrayParser
]))

const arrayParser = betweenSquareBrackets(commaSeparated(value))

console.log(
  arrayParser.run('[1,[2,[3],4],5]').result.flatMap(x => x)
)

