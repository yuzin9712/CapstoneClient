import React from 'react'
import { Box, Button } from '@material-ui/core'
import { goBack } from 'connected-react-router'
import { connect } from 'react-redux'

const NoMatch = ({goBack}) => {
  return(
    <Box>
      잘못된 주소입니다.
      <Button onClick={() => goBack()}>뒤로가기</Button>
    </Box>
  )
}

const mapStateToProps = state => ({
})

const mapDispatchToProps = (dispatch) => ({
  goBack: () => dispatch(goBack()),
})

export default connect(mapStateToProps, mapDispatchToProps)(NoMatch)
