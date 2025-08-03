// src/components/layout/footer/Footer.tsx
import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box component="footer" sx={{
      mt: "auto", // push to bottom
      width: "100%",
      height: "48px",
      background: "#222",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "14px"
    }}>
      <Typography variant="body2">© 2024 EDDI. All Rights Reserved.</Typography>
    </Box>
  );
};

export default Footer;
