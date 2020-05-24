import React from 'react'
import { Box, ButtonBase, Typography } from '@material-ui/core'
import { INTERVAL } from '../utils/constants'

export const CustomButton = ({ progress, flex = 1, label, onClick }) => (
  <ButtonBase
    onClick={onClick}
    focusRipple
    style={{
      flex,
      margin: 8,
      backgroundColor: 'lightgray',
      borderRadius: 4,
      overflow: 'hidden',
    }}
  >
    <Box
      flex={1}
      py={1}
      px={1}
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      zIndex={2}
    >
      <Typography style={{ fontSize: 12 }}>{label}</Typography>
    </Box>

    {typeof progress === 'number' && (
      <Box
        position="absolute"
        bgcolor="green"
        top={0}
        left={0}
        bottom={0}
        style={{ transition: `right ${INTERVAL - 1}ms` }}
        right={`${progress * 100}%`}
      />
    )}
  </ButtonBase>
)
