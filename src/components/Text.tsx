import React from 'react'
import { Text as RNText } from 'react-native'
import { withTheme } from 'react-native-paper'

type RNTextProps = React.ComponentProps<typeof RNText>

type TextProps = RNTextProps & {
  theme: any
  children: React.ReactNode
  h1?: boolean
  h2?: boolean
  h3?: boolean
  h4?: boolean
  body?: boolean
  caption?: boolean
  link?: boolean
}

const Text = (props: TextProps) => {
  const { typography, withBorder } = props.theme
  const { style: styleOverrides } = props

  return (
    <RNText
      {...props}
      style={[
        typography.body,
        props.h1 && typography.h1,
        props.h2 && typography.h2,
        props.h3 && typography.h3,
        props.h4 && typography.h4,
        props.caption && typography.caption,
        props.link && typography.link,
        styleOverrides,
        // withBorder,
      ]}
    >
      {props.children}
    </RNText>
  )
}

export default withTheme(Text)
