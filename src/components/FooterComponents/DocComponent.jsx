import { Container, Typography } from '@material-ui/core'
import React from 'react'

export default function DocComponent({title, children}) {
    return (
        <Container maxWidth='md' style={{paddingTop: 24}}>
            <Typography variant='h4'>
                {title}
            </Typography>
            {children}
        </Container>
    )
}
