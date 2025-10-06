import styled from "styled-components";
import { Box, Button, Typography } from "@mui/material";

export const SectionLabel = styled(Typography)`
  font-size: 14px;
  color: ${({ theme }) => theme.palette.text.secondary};
  margin-bottom: 8px;
`;

export const AlphaRow = styled(Box)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(36px, 1fr));
  gap: 8px;
`;

export const KeyBtn = styled(Button)<{ $active?: boolean }>`
  && {
    min-width: 36px;
    height: 36px;
    padding: 0;
    border-radius: 10px;
    font-weight: 700;

    border: 1px solid
      ${({ theme, $active }) => ($active ? theme.palette.primary.main : theme.palette.divider)};
    color: ${({ theme, $active }) =>
    $active ? theme.palette.primary.main : theme.palette.text.primary};
    background: ${({ theme, $active }) => ($active ? `${theme.palette.primary.main}20` : "transparent")};

    &:hover {
      border-color: ${({ theme }) => theme.palette.primary.main};
      background: ${({ theme }) => `${theme.palette.primary.main}14`};
    }
  }
`;
