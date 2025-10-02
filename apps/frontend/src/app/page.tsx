"use client";

import { useState } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import ProductList from "./components/ProductList";
import AddProductForm from "./components/AddProductForm";
import EditProductForm from "./components/EditProductForm";

// 建立自定義主題
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
  },
});

const StyledAppBar = styled(AppBar)(() => ({
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
}));

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: 16,
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
}));

interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  image?: string;
  stock?: number;
}

const Home = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleProductAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setEditingProduct(null);
  };

  const handleProductUpdated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          backgroundColor: "background.default",
        }}
      >
        {/* 頂部導航欄 */}
        <StyledAppBar position="static" elevation={0}>
          <Toolbar>
            <Typography
              variant="h5"
              component="div"
              sx={{ flexGrow: 1, fontWeight: "bold" }}
            >
              🛒 電商商品管理系統
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              管理您的商品庫存和資訊
            </Typography>
          </Toolbar>
        </StyledAppBar>

        {/* 主要內容區域 */}
        <StyledContainer maxWidth="xl">
          <Box sx={{ mb: 4 }}>
            {/* 新增商品表單 */}
            <AddProductForm onProductAdded={handleProductAdded} />
          </Box>

          {/* 商品列表區域 */}
          <StyledPaper elevation={0}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
              flexWrap="wrap"
              gap={2}
            >
              <Typography
                variant="h4"
                component="h2"
                fontWeight="bold"
                color="text.primary"
              >
                商品列表
              </Typography>
              <Button
                variant="contained"
                startIcon={<span>🔄</span>}
                onClick={() => setRefreshTrigger((prev) => prev + 1)}
                size="large"
                sx={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                  },
                }}
              >
                重新整理
              </Button>
            </Box>
            <ProductList
              refreshTrigger={refreshTrigger}
              onEditProduct={handleEditProduct}
            />
          </StyledPaper>
        </StyledContainer>

        {/* 編輯商品對話框 */}
        <EditProductForm
          product={editingProduct}
          open={editDialogOpen}
          onClose={handleEditDialogClose}
          onProductUpdated={handleProductUpdated}
        />
      </Box>
    </ThemeProvider>
  );
};

export default Home;
