'use client';
import { useState } from "react";
import { Box, Button, Container, List, ListItemText, TextField, Dialog, DialogActions, DialogTitle, DialogContent, IconButton, ListItem, ListItemButton, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Fab from '@mui/material/Fab';
import { styled } from '@mui/system';
import useSpots from './useSpots';

const Input = styled('input')({
  display: 'none',
});

export default function SpotList() {
  const { spots, addSpot, deleteSpot, updateSpot } = useSpots();
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [visible, setVisible] = useState(false);
  const [currentSpot, setCurrentSpot] = useState({ s_name: "", s_add: "", map: "", s_intro: "", imageUrl: "", coverUrls: [], hours: "", tel: "" });
  const [spotImage, setSpotImage] = useState<File | null>(null);
  const [movieStills, setMovieStills] = useState<File[]>([]);
  const [spotImagePreview, setSpotImagePreview] = useState<string | null>(null); // 用於顯示圖片預覽
  const [movieStillsPreviews, setMovieStillsPreviews] = useState<string[]>([]); // 用於顯示劇照預覽
  const [isEditing, setIsEditing] = useState(false);

  const handleListItemClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
    setSelectedIndex(index);
  };

  const showAddDialog = () => {
    setIsEditing(false);
    setCurrentSpot({ s_name: "", s_add: "", map: "", s_intro: "", imageUrl: "", coverUrls: [], hours: "", tel: "" });
    setVisible(true);
  };

  const hideAddDialog = () => setVisible(false);

  const handleDelete = async (index: number) => {
    const spotId = spots[index].id;
    await deleteSpot(spotId);
  };

  const handleEdit = (index: number) => {
    setIsEditing(true);
    setCurrentSpot({ ...spots[index] });
    setSelectedIndex(index);
    setVisible(true);
  };

  const handleSpotImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      setSpotImage(file);
      setSpotImagePreview(URL.createObjectURL(file)); // 顯示圖片預覽
    }
  };

  const handleMovieStillsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setMovieStills(files);
      setMovieStillsPreviews(files.map(file => URL.createObjectURL(file))); // 顯示劇照預覽
    }
  };

  const handleSaveAdd = async () => {
    const newSpot = { ...currentSpot };
    if (spotImage) {
      const imageUrl = await uploadImage(spotImage);
      newSpot.imageUrl = imageUrl;
    }
    if (movieStills.length > 0) {
      const coverUrls = await Promise.all(movieStills.map(file => uploadImage(file)));
      newSpot.coverUrls = coverUrls; // 儲存圖片為 coverUrls
    }

    await addSpot(newSpot);
    hideAddDialog();
  };

  const handleSaveEdit = async () => {
    const updatedSpot = { ...currentSpot };
    if (spotImage) {
      const imageUrl = await uploadImage(spotImage);
      updatedSpot.imageUrl = imageUrl;
    }
    if (movieStills.length > 0) {
      const coverUrls = await Promise.all(movieStills.map(file => uploadImage(file)));
      updatedSpot.coverUrls = coverUrls; // 儲存圖片為 coverUrls
    }

    await updateSpot(currentSpot.id, updatedSpot);
    hideAddDialog();
  };

  return (
    <Container maxWidth="sm">
      <Box>
        <Fab
          sx={{
            position: "fixed",
            bottom: (theme) => theme.spacing(2),
            right: (theme) => theme.spacing(2),
          }}
          color="primary"
          aria-label="Add"
          onClick={showAddDialog}
        >
          <AddIcon />
        </Fab>
        <List subheader="Spot list" aria-label="spot list">
          {spots.map((spot, index) => (
            <ListItem key={spot.id} component="div" disablePadding>
              <ListItemButton
                selected={selectedIndex === index}
                onClick={(event) => handleListItemClick(event, index)}
                divider
              >
                <ListItemText primary={spot.s_name} secondary={`${spot.s_add}`} />
                <Box sx={{ display: 'flex' }}>
                  <IconButton edge="end" aria-label="delete" sx={{
                    color: "#DE2626", // 按鈕圖標的顏色
                    "&:hover": {
                    color: "darkred", // 滑鼠懸停時的顏色
                    },}} 
                    onClick={() => handleDelete(index)}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="edit" sx={{
                    color: "#1D50A1", // 按鈕圖標的顏色
                    "&:hover": {
                    color: "#163D75", // 滑鼠懸停時的顏色
                    },}} 
                  onClick={() => handleEdit(index)}>
                    <EditIcon />
                  </IconButton>
                </Box>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* 新增/編輯景點的對話框 */}
      <Dialog open={visible} onClose={hideAddDialog}>
        <DialogTitle>{isEditing ? "編輯景點" : "新增景點"}</DialogTitle>
        <DialogContent>
          <TextField
            label="景點名稱"
            variant="outlined"
            name="s_name"
            value={currentSpot.s_name}
            onChange={(e) => setCurrentSpot({ ...currentSpot, s_name: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="景點地址"
            variant="outlined"
            name="s_add"
            value={currentSpot.s_add}
            onChange={(e) => setCurrentSpot({ ...currentSpot, s_add: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Google Map"
            variant="outlined"
            name="map"
            value={currentSpot.map}
            onChange={(e) => setCurrentSpot({ ...currentSpot, map: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="營業時間"
            variant="outlined"
            name="hours"
            value={currentSpot.hours}
            onChange={(e) => setCurrentSpot({ ...currentSpot, hours: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="電話"
            variant="outlined"
            name="tel"
            value={currentSpot.tel}
            onChange={(e) => setCurrentSpot({ ...currentSpot, tel: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="景點介紹"
            variant="outlined"
            name="s_intro"
            value={currentSpot.s_intro}
            onChange={(e) => setCurrentSpot({ ...currentSpot, s_intro: e.target.value })}
            fullWidth
            multiline
            rows={4}
            margin="dense"
          />
          
          {/* 顯示目前的景點圖片 */}
{currentSpot.imageUrl && (
  <Box sx={{ mt: 2 }}>
    <Typography variant="body2" component="p" gutterBottom>
      目前的景點圖片：
    </Typography>
    <img 
      src={currentSpot.imageUrl} 
      alt="Current Spot" 
      style={{ width: '200px', height: '150px'}}  // 調整為一半大小
    />
  </Box>
)}

{/* 顯示目前的劇照 */}
{currentSpot.coverUrls.length > 0 && (
  <Box sx={{ mt: 2 }}>
    <Typography variant="body2" component="p" gutterBottom>
      目前的劇照：
    </Typography>
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
      {currentSpot.coverUrls.map((url, index) => (
        <img 
          key={index} 
          src={url} 
          alt={`Cover ${index + 1}`} 
          style={{ width: '200px', height: '150px' }}  // 設定大小
        />
      ))}
    </Box>
  </Box>
)}



          {/* 選擇景點圖片 */}
          <Box my={2} sx={{ backgroundColor: '#f4f6f8', borderRadius: '8px', padding: '16px' }}>
            <Typography variant="body1">選擇景點圖片：</Typography>
            <label htmlFor="spot-image-upload">
              <Input
                accept="*"
                id="spot-image-upload"
                type="file"
                onChange={handleSpotImageChange}
              />
              <Button variant="contained" component="span">
                選擇檔案
              </Button>
            </label>
            {spotImage && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" component="p" gutterBottom>
                  檔案名稱: {spotImage.name}
                </Typography>
                <img src={spotImagePreview} alt="Selected Spot Image" style={{ width: '100%', height: 'auto' }} />
              </Box>
            )}
          </Box>

          {/* 選擇劇照 */}
          <Box my={2} sx={{ backgroundColor: '#f4f6f8', borderRadius: '8px', padding: '16px' }}>
            <Typography variant="body1">選擇劇照：</Typography>
            <label htmlFor="movie-stills-upload">
              <Input
                accept="*"
                id="movie-stills-upload"
                type="file"
                multiple
                onChange={handleMovieStillsChange}
              />
              <Button variant="contained" component="span">
                選擇檔案
              </Button>
            </label>
            {movieStills.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" component="p" gutterBottom>
                  已選擇 {movieStills.length} 個檔案
                </Typography>
                {movieStillsPreviews.map((preview, index) => (
                  <img key={index} src={preview} alt={`Movie Still ${index + 1}`} style={{ width: '100%', height: 'auto', marginBottom: '10px' }} />
                ))}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={hideAddDialog}
            variant="contained"
            sx={{ backgroundColor: "#FF5722", color: "white", "&:hover": { backgroundColor: "#E64A19" } }}
          >
            取消
          </Button>
          <Button
            onClick={isEditing ? handleSaveEdit : handleSaveAdd}
            variant="contained"
            sx={{ backgroundColor: "#4CAF50", color: "white", "&:hover": { backgroundColor: "#388E3C" } }}
          >
            {isEditing ? "儲存" : "新增"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/uploadFile/`, {
    method: 'POST',
    body: formData,
  });
  const data = await response.json();
  return data.url;
}
