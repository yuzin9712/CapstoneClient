// 이미지 넣는친구
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, ButtonBase, Avatar,
} from '@material-ui/core'
import { Cancel, PhotoCamera } from '@material-ui/icons';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
    hide: {
        display: 'none',
    },
    previewImage: {
        width: theme.spacing(20),
        height: theme.spacing(20),
    },
    previewCancel: {
        border: "1px solid white",
        backgroundColor: "white",
        borderRadius: "50%",
        position: "absolute",
        top: '1px',
        right: '1px',
    },
}));

const ImageInput = ({name = "photo", images, setImages, maxInput = 3}) => {
    const classes = useStyles();

    const handleImageInput = (event) => {
        if(images.length < maxInput){
          if(event.target.files[0] !== undefined){
            setImages([...images, event.target.files[0]]);
          }
        }
      }
      const removeImage = (index) => {
        const newList = [...images];
        newList.splice(index, 1);
        setImages(newList);
      }
      
    return(
        <Grid container>
        {images.map((image, index) => {
            return(
            <React.Fragment>
                <ButtonBase variant="rounded">
                <Avatar src={URL.createObjectURL(image)} 
                    variant="rounded"
                    className={classes.previewImage}
                />
                </ButtonBase>
                <ButtonBase onClick={() => removeImage(index)}>
                <Cancel className={classes.previewCancel}/>
                </ButtonBase>
            </React.Fragment>
            )
        })}
        <input 
            accpet="image/*"
            className={classes.hide}
            id={name}
            multiple
            type="file"
            onChange={(event) => handleImageInput(event)}
        />
        <label htmlFor={name}>
        <Avatar variant="rounded" className={clsx({
            [classes.previewImage]: true,
            [classes.hide]: images.length >= maxInput
        })}>
            <PhotoCamera />
        </Avatar>
        </label>
    </Grid>
    )
}

ImageInput.propTypes = {
    //pathname: PropTypes.string,
    //search: PropTypes.string,
    //hash: PropTypes.string,
}


const mapStateToProps = state => ({
    //pathname: state.router.location.pathname,
    //search: state.router.location.search,
    //hash: state.router.location.hash,
})

const mapDispatchToProps = (dispatch) => ({
    
})

export default connect(mapStateToProps, mapDispatchToProps)(ImageInput)
