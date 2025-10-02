"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  image?: string;
  stock?: number;
}

interface ProductListProps {
  refreshTrigger: number;
  onEditProduct?: (product: Product) => void;
}

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[8],
  },
}));

const StyledCardMedia = styled(CardMedia)({
  height: 200,
  objectFit: "cover",
});

const PriceTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: "bold",
}));

const ProductList = ({ refreshTrigger, onEditProduct }: ProductListProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/products");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "載入商品失敗");
        console.error("載入商品時發生錯誤:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [refreshTrigger]);

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      setDeleteLoading(true);
      const response = await fetch(`/api/products/${productToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      setSuccessMessage("商品刪除成功");
      setDeleteDialogOpen(false);
      setProductToDelete(null);

      // 重新載入商品列表
      const fetchProducts = async () => {
        try {
          const response = await fetch("/api/products");
          if (response.ok) {
            const data = await response.json();
            setProducts(data);
          }
        } catch (err) {
          console.error("重新載入商品時發生錯誤:", err);
        }
      };
      fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "刪除商品失敗");
      console.error("刪除商品時發生錯誤:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleEditClick = (product: Product) => {
    if (onEditProduct) {
      onEditProduct(product);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          載入商品中...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        <Typography variant="h6">載入失敗</Typography>
        <Typography>{error}</Typography>
      </Alert>
    );
  }

  if (products.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 4,
          textAlign: "center",
          backgroundColor: "grey.50",
        }}
      >
        <Typography variant="h6" color="text.secondary">
          目前沒有商品
        </Typography>
      </Paper>
    );
  }

  return (
    <>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, p: 2 }}>
        {products.map((product) => (
          <Box
            key={product.id}
            sx={{ flex: "1 1 300px", minWidth: "300px", maxWidth: "400px" }}
          >
            <StyledCard elevation={2}>
              {product.image && (
                <StyledCardMedia image={product.image} title={product.name} />
              )}
              <CardContent
                sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
              >
                <Typography
                  variant="h6"
                  component="h3"
                  gutterBottom
                  sx={{
                    fontWeight: "bold",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {product.name}
                </Typography>

                {product.description && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      flexGrow: 1,
                    }}
                  >
                    {product.description}
                  </Typography>
                )}

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: "auto",
                  }}
                >
                  <PriceTypography variant="h5">
                    NT$ {product.price.toLocaleString()}
                  </PriceTypography>

                  {product.stock !== undefined && (
                    <Chip
                      label={
                        product.stock > 0 ? `庫存: ${product.stock}` : "缺貨"
                      }
                      color={product.stock > 0 ? "success" : "error"}
                      size="small"
                      variant={product.stock > 0 ? "outlined" : "filled"}
                    />
                  )}
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 1,
                    mt: 2,
                  }}
                >
                  <IconButton
                    color="primary"
                    onClick={() => handleEditClick(product)}
                    sx={{
                      backgroundColor: "primary.light",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "primary.main",
                      },
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteClick(product)}
                    sx={{
                      backgroundColor: "error.light",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "error.main",
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </StyledCard>
          </Box>
        ))}
      </Box>

      {/* 刪除確認對話框 */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>確認刪除商品</DialogTitle>
        <DialogContent>
          <Typography>
            您確定要刪除商品「{productToDelete?.name}」嗎？
          </Typography>
          <Typography color="error" sx={{ mt: 1 }}>
            此操作無法復原！
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={deleteLoading}>
            取消
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteLoading}
            startIcon={
              deleteLoading ? <CircularProgress size={20} /> : <DeleteIcon />
            }
          >
            {deleteLoading ? "刪除中..." : "確認刪除"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 成功訊息 */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProductList;
