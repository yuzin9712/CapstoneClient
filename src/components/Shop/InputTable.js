// "/shop/productupload"에서 상품등록
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Container,
  Paper,
  Typography,
  Button,
  Divider,
  IconButton,
  TextField,
  ButtonBase,
  Avatar,
  GridList,
  GridListTile,
  Box,
  Radio,
  FormControlLabel,
  RadioGroup,
  FormControl,
  FormLabel,
  Table,
  TableCell,
  TableRow,
  Tooltip,
} from '@material-ui/core'
import { Add, Remove } from '@material-ui/icons';
import clsx from 'clsx'

const useStyles = makeStyles((theme) => ({
    hide: {
        display: 'none',
    },
}));

const MAX_SIZE_COUNT = 8
const MAX_COLOR_COUNT = 4

const InputTable = ({ category, colorArray, setColorArray, sizeArray, setSizeArray, quantityArray, setQuantityArray,  disableSize, setDisableSize, }) => {
  const classes = useStyles();
  
  useEffect(() => {
    switch(category){
      case "1":
      case "2": { 
        setSizeArray(["S", "M", "L", "XL"])
        setQuantityArray(colorArray.map((quantityByColor) => ["", "", "", ""]))
        setDisableSize(true)
        break
      }
      case "3": { // 패션잡화: 사이즈없음
        setSizeArray([""])
        setQuantityArray(colorArray.map((quantityByColor) => [""]))
        setDisableSize(true)
        break
      }
      case "4": { // 신발: 사이즈도 입력
        setDisableSize(false)
        break
      }
      default: {}
    }
  }, [category])

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  }
  const handleSizeChange = (event, index) => {
    const newArray = [...sizeArray]
    newArray[index] = event.target.value
    setSizeArray(newArray)
  }
  const handleColorChange = (event, index) => {
    const newArray = [...colorArray]
    newArray[index] = event.target.value
    setColorArray(newArray)
  }
  const handleQuantityChange = (event, colorIndex, sizeIndex) => {
    const newArray = [...quantityArray]
    newArray[colorIndex][sizeIndex] = event.target.value
    setQuantityArray(newArray)
  }
  const handleSizeAdd = () => {
    setSizeArray([...sizeArray, ""])
    setQuantityArray(quantityArray.map((quantityByColor) => [...quantityByColor, ""]))
  }
  const handleColorAdd = () => {
    if(colorArray.length < MAX_COLOR_COUNT){
      setColorArray([...colorArray, ""])
      setQuantityArray([...quantityArray, sizeArray.reduce((result) => {
        result = [...result, ""]
        return result
      },[])])
    }
  }
  const handleSizeRemove = (sizeIndex) => {
    setSizeArray([...sizeArray.slice(0,sizeIndex), ...sizeArray.slice(sizeIndex+1)])
    setQuantityArray(quantityArray.map((quantityByColor) => [...quantityByColor.slice(0,sizeIndex), ...quantityByColor.slice(sizeIndex+1)]))
  }
  const handleColorRemove = (colorIndex) => {
    setColorArray([...colorArray.slice(0,colorIndex), ...colorArray.slice(colorIndex+1)])
    setQuantityArray([...quantityArray.slice(0,colorIndex), ...quantityArray.slice(colorIndex+1)])
  }

  return(
    <Table className={clsx({
      [classes.hide]: category === "0"
    })}>
      <TableRow className={clsx({
        [classes.hide]: category === "3"
      })}>
        <TableCell />
        {sizeArray.map((size, sizeIndex) => {
          return (
            <TableCell>
              <Tooltip title="사이즈 삭제~" className={clsx({
                [classes.hide]: sizeArray.length <= 1 || disableSize
              })}>
                <IconButton size="small" onClick={() => handleSizeRemove(sizeIndex)}>
                  <Remove />
                </IconButton>
              </Tooltip>
              <TextField
              disabled={disableSize}
              variant="outlined"
              id="size"
              size="small"
              value={size}
              onChange={(event) => handleSizeChange(event, sizeIndex)}
              label={"사이즈"} />
            </TableCell>
          )
        })}
        <TableCell rowSpan={colorArray.length+1} className={clsx({
          [classes.hide]: sizeArray.length >= MAX_SIZE_COUNT || disableSize
        })}>
          <Tooltip title="사이즈 추가">
            <IconButton onClick={handleSizeAdd}>
              <Add />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      {colorArray.map((color, colorIndex) => {
        return <TableRow>
          <Box display="flex" alignItems="center" component={TableCell}>
              <Tooltip title="색상 삭제~" className={clsx({
                [classes.hide]: colorArray.length <= 1
              })}>
                <IconButton size="small" onClick={() => handleColorRemove(colorIndex)}>
                  <Remove />
                </IconButton>
              </Tooltip>
              <Box flexGrow={1} component={TextField}
              variant="outlined"
              id="color"
              size="small"
              value={color}
              onChange={(event) => handleColorChange(event, colorIndex)}
              label={"색상"} />
            </Box>
          {quantityArray[colorIndex].map((quantity, sizeIndex) => {
            return <TableCell component={TextField} 
            variant="outlined"
            id="quantity"
            size="small"
            value={quantity}
            onChange={(event) => handleQuantityChange(event, colorIndex, sizeIndex)}
            label={"재고"} />
          })}
        </TableRow>
      })}
      <TableRow className={clsx({
        [classes.hide]: colorArray.length >= MAX_COLOR_COUNT
      })}>
        <TableCell colSpan={sizeArray.length+1}>
          <Tooltip title="색상 추가~">
            <IconButton onClick={handleColorAdd}>
              <Add />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
    </Table>
  )
}

InputTable.propTypes = {
    //pathname: PropTypes.string,
    //search: PropTypes.string,
    //hash: PropTypes.string,
}


const mapStateToProps = state => ({
})

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(InputTable)
