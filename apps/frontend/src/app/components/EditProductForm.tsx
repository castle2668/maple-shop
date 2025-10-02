"use client";

import { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { styled } from "@mui/material/styles";

interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  image?: string;
  stock?: number;
}

interface EditProductFormProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onProductUpdated: () => void;
}

interface ProductFormData {
  name: string;
  price: string;
  description: string;
  image: string;
  stock: string;
}

const StyledButton = styled(Button)(() => ({
  minHeight: "48px",
  fontWeight: "bold",
}));

export default function EditProductForm({
  product,
  open,
  onClose,
  onProductUpdated,
}: EditProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    price: "",
    description: "",
    image: "",
    stock: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // 當商品資料改變時，更新表單資料
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        price: product.price?.toString() || "",
        description: product.description || "",
        image: product.image || "",
        stock: product.stock?.toString() || "",
      });
    }
  }, [product]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      // 驗證必填欄位
      if (!formData.name.trim()) {
        throw new Error("商品名稱為必填項目");
      }
      if (!formData.price.trim()) {
        throw new Error("商品價格為必填項目");
      }

      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        throw new Error("請輸入有效的價格");
      }

      const stock = formData.stock ? parseInt(formData.stock) : undefined;
      if (stock !== undefined && (isNaN(stock) || stock < 0)) {
        throw new Error("請輸入有效的庫存數量");
      }

      const productData = {
        name: formData.name.trim(),
        price: price,
        description: formData.description.trim() || undefined,
        image: formData.image.trim() || undefined,
        stock: stock,
      };

      const response = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const updatedProduct = await response.json();
      console.log("更新商品成功:", updatedProduct);

      // 通知父組件更新商品列表
      onProductUpdated();

      // 顯示成功訊息並立即關閉對話框
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "更新商品失敗");
      console.error("更新商品時發生錯誤:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setError(null);
      setSuccess(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>✏️ 編輯商品</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="h6">更新失敗</Typography>
            <Typography>{error}</Typography>
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <TextField
                fullWidth
                label="商品名稱"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="請輸入商品名稱"
                variant="outlined"
                helperText="必填項目"
                sx={{ flex: "1 1 300px" }}
              />

              <FormControl sx={{ flex: "1 1 300px" }} variant="outlined">
                <InputLabel htmlFor="price">價格</InputLabel>
                <OutlinedInput
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  inputProps={{ min: "0", step: "0.01" }}
                  startAdornment={
                    <InputAdornment position="start">NT$</InputAdornment>
                  }
                  label="價格"
                  placeholder="請輸入商品價格"
                />
              </FormControl>
            </Box>

            <TextField
              fullWidth
              label="商品描述"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              multiline
              rows={3}
              placeholder="請輸入商品描述（選填）"
              variant="outlined"
            />

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <TextField
                fullWidth
                label="商品圖片網址"
                name="image"
                type="url"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="請輸入圖片網址（選填）"
                variant="outlined"
                sx={{ flex: "1 1 300px" }}
              />

              <TextField
                fullWidth
                label="庫存數量"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleInputChange}
                inputProps={{ min: "0" }}
                placeholder="請輸入庫存數量（選填）"
                variant="outlined"
                sx={{ flex: "1 1 300px" }}
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={handleClose}
          disabled={isSubmitting}
          size="large"
          variant="outlined"
        >
          取消
        </Button>
        <StyledButton
          onClick={handleSubmit}
          variant="contained"
          size="large"
          disabled={isSubmitting}
          startIcon={
            isSubmitting ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <span>💾</span>
            )
          }
        >
          {isSubmitting ? "更新中..." : "更新商品"}
        </StyledButton>
      </DialogActions>

      <Snackbar
        open={success}
        autoHideDuration={2000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          <Typography variant="h6">更新成功！</Typography>
          <Typography>商品資訊已成功更新</Typography>
        </Alert>
      </Snackbar>
    </Dialog>
  );
}
