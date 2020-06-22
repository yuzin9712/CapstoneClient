// 디자인 만들기 컴포넌트
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import ChipInput from 'material-ui-chip-input'

const TagInput = ({ label = '태그 입력', tags, setTags }) => {
  const [ textInput, setTextInput ] = useState('')

  const handleAddChip = (chip) => {
    setTags([...tags, ...chip.split("#").filter((chip) => chip.length != 0)])
    setTextInput('')
  }
  const handleDeleteChip = (chip, index) => {
    const newList = [...tags];
    newList.splice(index, 1);
    setTags(newList);
  }
  const handleKeyDown = (event) => {
    if(event.key === ' '){
      event.preventDefault()
      handleAddChip(event.target.value)
    }
  }

  return(
    <ChipInput 
    label={label}
    fullWidth
    value={tags}
    inputValue={textInput}
    onKeyDown={(event) => handleKeyDown(event)}
    onUpdateInput={(event) => setTextInput(event.target.value)}
    onAdd={(chip) => handleAddChip(chip)}
    onDelete={(chip, index) => handleDeleteChip(chip, index)}
    />
  )
}

TagInput.propTypes = {
  label: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  setTags: PropTypes.func.isRequired,
}

export default TagInput
