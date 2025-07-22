import React, { useEffect } from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import CommentIcon from '@mui/icons-material/Comment';
import * as XLSX from 'xlsx';
import { Tooltip } from "@mui/material";
const filename: string = 'projectprime_datamap.xlsx';
import { FixedSizeList } from 'react-window';
import type { ListChildComponentProps } from 'react-window';


interface DatamapListProps {
  selectedValues: Set<string>;
 setSelectedValues: React.Dispatch<React.SetStateAction<Set<string>>>;
}


interface DatamapListItem {
  name: string;
  description: string;
  selected: boolean;
}


export default function DatamapList({selectedValues, setSelectedValues}: DatamapListProps) {
  const [listItems, setListItems] = React.useState<DatamapListItem[]>([])


  function readXLSX(filePath:string) {
  fetch(filePath)
    .then(res => res.arrayBuffer())
    .then(arrayBuffer => {
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const jsonRows = jsonData.length;

      for(let i = 3; i < jsonRows; i++){
        if (jsonData[i].length > 23) {
          const tempData: DatamapListItem = {
            name: jsonData[i][1],
            description: jsonData[i][23],
            selected: false
          };
          listItems.push(tempData);
        }
      }
     
    })
    .catch(error => console.error("Error reading XLSX:", error));
}
   useEffect(() => {
  readXLSX(filename);
    }, []);


 


  const handleCheckToggle = (item: DatamapListItem) => () => {
     var isSelected = item.selected;
     if ( item.selected === false && selectedValues.size < 10) {
       setSelectedValues(prevName => new Set<string>([...prevName, item.name]))
       setListItems(listItems.map(obj =>
         obj.name === item.name ? { ...obj, selected: true } : obj
       ));
     } else if (isSelected === true && selectedValues.size >0) {
       setSelectedValues(prevName => {
         const filtered = Array.from(prevName).filter(str => str !== item.name);
         return new Set(filtered);
       })
       setListItems(listItems.map(obj =>
         obj.name === item.name ? { ...obj, selected: false } : obj
       ));
     }
  };




 function changeFontSize(text:String){
    if (text.length> 42) {
      return 7;
    }
    else if (text.length> 27) {
      return 10;
    }
    else {
      return 12;
    }
 }
   
 function renderRow(props: ListChildComponentProps) {
  const { index, style } = props;
  const item = listItems[index];
  if (!item) return null;
  const labelId = `checkbox-list-label-${item.name}`;
  return (
    <ListItem
      key={index}
      style={style}
      secondaryAction={
        <Tooltip title={item.description} placement="top-start">
          <IconButton edge="end" aria-label="comments">
            <CommentIcon />
          </IconButton>
        </Tooltip>
      }
      disablePadding
    >
      <ListItemButton role={undefined} onClick={handleCheckToggle(item)} dense>
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={item.selected}
            tabIndex={-1}
            disableRipple
            inputProps={{ 'aria-labelledby': labelId }}
          />
        </ListItemIcon>
        <ListItemText
          id={labelId}
          primary={item.name}
          primaryTypographyProps={{
            sx: {
              fontSize: changeFontSize(item.name),
            }
          }}
        />
      </ListItemButton>
    </ListItem>
  );
}




  return (
    <List sx={{ width: '100%', maxWidth: 340, maxHeight: 480, bgcolor: 'background.paper', overflowX: 'hidden'}}>
   
        <FixedSizeList
        height={480}
        width={340}
        itemSize={46}
        itemCount={6000}
        overscanCount={5}
      >
        {renderRow}
      </FixedSizeList>
   
    </List>
  );
}

