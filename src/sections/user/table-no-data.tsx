import type { TableRowProps } from "@mui/material/TableRow";

import Box from "@mui/material/Box";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";

// ----------------------------------------------------------------------

type TableNoDataProps = TableRowProps & {
  searchQuery: string;
};

export function TableNoData({ searchQuery, ...other }: TableNoDataProps) {
  return (
    <TableRow {...other}>
      <TableCell align="center" colSpan={7}>
        <Box sx={{ py: 15, textAlign: "center" }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            검색 결과가 없습니다!
          </Typography>

          <Typography variant="body2">
            다음과 일치하는 감정 태그가 없습니다. &nbsp;
            <strong>&quot;{searchQuery}&quot;</strong>.
            <br /> 정확한 감정 태그를 검색해보세요!
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  );
}
