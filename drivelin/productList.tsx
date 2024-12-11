"use client";
import { useState } from 'react';
import { Box, Button, Container, List, ListItemText, TextField, Dialog, DialogActions, DialogTitle, DialogContent, IconButton, ListItem, ListItemButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Fab from '@mui/material/Fab';
import useProducts from './useProducts';

export default function ProductList() {
  const { products, addProduct, deleteProduct, updateProduct } = useProducts();
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({ desc: "", price: 0 });

  const handleListItemClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
    setSelectedIndex(index);
  };

  const showAddDialog = () => setVisible(true);
  const hideAddDialog = () => setVisible(false);

  const handleDelete = async (index: number) => {
    const productId = products[index].id;
    await deleteProduct(productId);
  };

  const handleEdit = (index: number) => {
    setCurrentProduct({ ...products[index] });
    setSelectedIndex(index);
    setEditVisible(true);
  };

  const handleEditClose = () => setEditVisible(false);

  const handleSaveEdit = async () => {
    const productId = products[selectedIndex].id;
    await updateProduct(productId, currentProduct);
    handleEditClose();
  };

  return (
    <Container maxWidth="sm">
      <Box>
        <Fab
          sx={{
            position: "fixed",
            bottom: (theme) => theme.spacing(2),
            right: (theme) => theme.spacing(2)
          }}
          color="primary"
          aria-label="Add"
          onClick={showAddDialog}
        >
          <AddIcon />
        </Fab>
        <List subheader="Product list" aria-label="product list">
          {products.map((product, index) => (
            <ListItem key={product.id} component="div" disablePadding>
              <ListItemButton
                selected={selectedIndex === index}
                onClick={(event) => handleListItemClick(event, index)}
                divider
              >
                <ListItemText primary={product.desc} secondary={`$${product.price}`} />
                <Box sx={{ display: 'flex' }}>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(index)}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(index)}>
                    <EditIcon />
                  </IconButton>
                </Box>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* 新增產品的對話框 */}
      <ProductAdd visible={visible} hide={hideAddDialog} addProduct={addProduct} />

      {/* 編輯產品的對話框 */}
      <Dialog open={editVisible} onClose={handleEditClose} aria-labelledby="編輯產品">
        <DialogTitle>編輯產品</DialogTitle>
        <DialogContent>
          <TextField
            label="產品描述"
            variant="outlined"
            name="desc"
            value={currentProduct.desc}
            onChange={(e) => setCurrentProduct({ ...currentProduct, desc: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="產品價格"
            variant="outlined"
            name="price"
            value={currentProduct.price}
            onChange={(e) => setCurrentProduct({ ...currentProduct, price: Number(e.target.value) })}
            fullWidth
            margin="dense"
            type="number"
          />
        </DialogContent>
        <DialogActions>
          <IconButton
            aria-label="close"
            onClick={handleEditClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
          <Button variant="contained" color="primary" onClick={handleSaveEdit}>
            儲存
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

function ProductAdd({ visible, hide, addProduct }: { visible: boolean; hide: () => void; addProduct: (product: { desc: string; price: number }) => Promise<void>; }) {
  const [newProduct, setNewProduct] = useState({ desc: "", price: 0 });

  const handleClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    await addProduct(newProduct);
    hide();
  };

  return (
    <Dialog open={visible} onClose={hide} aria-labelledby="新增產品">
      <DialogTitle>新增產品</DialogTitle>
      <DialogContent>
        <TextField
          label="產品描述"
          variant="outlined"
          name="desc"
          value={newProduct.desc}
          onChange={handleClick}
          fullWidth
          margin="dense"
        />
        <TextField
          label="產品價格"
          variant="outlined"
          name="price"
          value={newProduct.price}
          onChange={handleClick}
          fullWidth
          margin="dense"
          type="number"
        />
      </DialogContent>
      <DialogActions>
        <IconButton
          aria-label="close"
          onClick={hide}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
        <Button variant="contained" color="primary" onClick={handleAdd}>
          新增
        </Button>
      </DialogActions>
    </Dialog>
  );
}
