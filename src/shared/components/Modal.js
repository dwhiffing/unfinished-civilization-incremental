import React from 'react'
import { Box } from '@material-ui/core'

export const Modal = ({ children, onClose }) => {
  return (
    <Box
      style={{ pointerEvents: children ? 'auto' : 'none' }}
      position="fixed"
      top={0}
      left={0}
      bottom={0}
      zIndex={997}
      right={0}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        style={{ pointerEvents: children ? 'auto' : 'none' }}
        position="absolute"
        onClick={onClose}
        bgcolor={`rgba(0,0,0,${children ? 0.4 : 0})`}
        top={0}
        left={0}
        zIndex={-1}
        bottom={0}
        right={0}
      />
      <Box
        className="modal"
        m={2}
        width="100%"
        maxWidth={650}
        maxHeight={500}
        color="white"
        p={2}
        boxSizing="border-box"
        style={{
          transition: 'opacity 350ms',
          opacity: children ? 1 : 0,
          background: '#000',
          boxShadow: '0px 3px 15px rgba(0, 0, 0, 0.38)',
          borderRadius: 0,
          overflowY: 'auto',
          borderWidth: 2,
          borderStyle: 'solid',
          pointerEvents: children ? 'auto' : 'none',
          borderColor: '#999',
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
