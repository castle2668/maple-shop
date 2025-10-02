"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
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
} from "@mui/material";
import { styled } from "@mui/material/styles";

interface AddProductFormProps {
  onProductAdded: () => void;
}

interface ProductFormData {
  name: string;
  price: string;
  description: string;
  image: string;
  stock: string;
}

const StyledCard = styled(Card)(({ theme }) => ({
  margin: theme.spacing(2),
  boxShadow: theme.shadows[4],
}));

const StyledButton = styled(Button)(() => ({
  minHeight: "48px",
  fontWeight: "bold",
}));

export default function AddProductForm({
  onProductAdded,
}: AddProductFormProps) {
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

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const newProduct = await response.json();
      console.log("新增商品成功:", newProduct);

      setSuccess(true);
      setFormData({
        name: "",
        price: "",
        description: "",
        image: "",
        stock: "",
      });

      // 通知父組件更新商品列表
      onProductAdded();

      // 3秒後隱藏成功訊息
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "新增商品失敗");
      console.error("新增商品時發生錯誤:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      price: "",
      description: "",
      image: "",
      stock: "",
    });
    setError(null);
    setSuccess(false);
  };

  return (
    <>
      <StyledCard>
        <CardContent>
          <Box display="flex" alignItems="center" mb={3}>
            <Typography variant="h4" component="h2" fontWeight="bold">
              ➕ 新增商品
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              <Typography variant="h6">新增失敗</Typography>
              <Typography>{error}</Typography>
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
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

            <Box display="flex" gap={2} mt={4}>
              <StyledButton
                type="submit"
                variant="contained"
                size="large"
                disabled={isSubmitting}
                startIcon={
                  isSubmitting ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <span>➕</span>
                  )
                }
                sx={{ flex: 1 }}
              >
                {isSubmitting ? "新增中..." : "新增商品"}
              </StyledButton>

              <StyledButton
                type="button"
                variant="outlined"
                size="large"
                onClick={handleReset}
                startIcon={<span>🔄</span>}
              >
                重設
              </StyledButton>
            </Box>
          </Box>
        </CardContent>
      </StyledCard>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          <Typography variant="h6">新增成功！</Typography>
          <Typography>商品已成功新增到列表中</Typography>
        </Alert>
      </Snackbar>
    </>
  );
}
