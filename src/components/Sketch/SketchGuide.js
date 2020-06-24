// "/message"에서 확인하는 장바구니페이지
import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, Box, Typography, Divider, Paper, ButtonBase, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, IconButton, Tooltip, MobileStepper, LinearProgress, Step, StepButton, Stepper,
} from '@material-ui/core'
import { push } from 'connected-react-router';
import SwipeableViews from 'react-swipeable-views';
import { KeyboardArrowRight, KeyboardArrowLeft } from '@material-ui/icons';
// const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const useStyles = makeStyles((theme) => ({
  circle: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
  // previewCancel: {
  //     border: "1px solid white",
  //     backgroundColor: "white",
  //     borderRadius: "50%",
  //     position: "absolute",
  //     top: '1px',
  //     right: '1px',
  // },
}));

const SketchGuide = ({children = [], interval = 8000}) => {
  const classes = useStyles();
  const [progress, setProgress] = React.useState(0);
  const [activeStep, setActiveStep] = React.useState(0);
  const [stepper, setStepper] = useState(null)
  const maxSteps = children.length;

  if(interval > 0){
    const tick = 10000 / interval
  
    React.useEffect(() => {
      const timer = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress === 100) {
            handleNext()
            return 0;
          }
          return Math.min(oldProgress + tick, 100);
        });
      }, 100);
  
      return () => {
        clearInterval(timer);
      };
    }, []);
  }
  useEffect(() => {
    setStepper(
      children.map((child, index) => {
        const color = index === activeStep?"primary":"default"
        return(
          <IconButton color={color} disableRipple size="small" onClick={() => handleStepChange(index)}>
            <div className={classes.circle} />
          </IconButton>
        )
      })
    )
    setProgress(0)
  }, [activeStep])

  const handleNext = () => {
    setActiveStep((prevActiveStep) => {
      const nextStep = prevActiveStep + 1
      if(nextStep === maxSteps) return 0
      else return nextStep
    });
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => {
      const nextStep = prevActiveStep - 1
      if(nextStep === -1) return maxSteps - 1
      else return nextStep
    });
  };
  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return(
    <Box width={1} p={1} display="flex" flexDirection="column" alignItems="center">
      <Box width={1} display="flex" flexDirection="row" alignItems="center">
        <IconButton size="small" onClick={handleBack}>
          <KeyboardArrowLeft />
        </IconButton>
        <Box flexGrow={1} p={1} display="flex" flexDirection="column">
          <SwipeableViews
          axis='x'
          index={activeStep}
          onChangeIndex={handleStepChange}
          enableMouseEvents
          >
            {children}
          </SwipeableViews>
          {interval !== 0?<LinearProgress variant="determinate" value={progress} />:null}
        </Box>
        <IconButton size="small" onClick={handleNext}>
          <KeyboardArrowRight />
        </IconButton>
      </Box>
      <Box p={2} display="flex" flexDirection="row" alignItems="center">
        {stepper}
      </Box>
    </Box>
  )
}

SketchGuide.propTypes = {
  //pathname: PropTypes.string,
  //search: PropTypes.string,
  //hash: PropTypes.string,
}


const mapStateToProps = state => ({
  authStore: state.auth,
  //pathname: state.router.location.pathname,
  //search: state.router.location.search,
  //hash: state.router.location.hash,
})

const mapDispatchToProps = (dispatch) => ({
  push: (url) => dispatch(push(url))
})

export default connect(mapStateToProps, mapDispatchToProps)(SketchGuide)
