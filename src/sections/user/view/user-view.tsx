import { useState, useEffect, useCallback } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";

import { DashboardContent } from "../../../layouts/dashboard";
import { Iconify } from "../../../dashboardComponents/iconify";
import { Scrollbar } from "../../../dashboardComponents/scrollbar";

import { TableNoData } from "../table-no-data";
import { UserTableRow } from "../user-table-row";
import { UserTableHead } from "../user-table-head";
import { TableEmptyRows } from "../table-empty-rows";
import { UserTableToolbar } from "../user-table-toolbar";
import { emptyRows, applyFilter, getComparator } from "../utils";
import { useAuthStore } from "../../../hooks/stores/use-auth-store"; // Store 사용

// 환경 변수에서 API URL을 가져옴
const getAPIURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;

  // 환경 변수가 있고, placeholder가 아니고, 유효한 URL인 경우에만 사용
  if (
    envUrl &&
    !envUrl.includes("YOUR_SERVER_IP") &&
    envUrl.startsWith("http")
  ) {
    return envUrl.replace(/\/api$/, ""); // /api 제거 (이미 포함되어 있을 수 있음)
  }

  // 환경 변수가 없으면 에러
  console.error("❌ VITE_API_URL 환경 변수가 설정되지 않았습니다.");
  console.error("개발 환경에서는 .env 파일에 VITE_API_URL을 설정하세요.");
  console.error("프로덕션 환경에서는 Vercel 환경 변수를 확인하세요.");
  throw new Error(
    "VITE_API_URL 환경 변수가 필요합니다. .env 파일 또는 Vercel 환경 변수를 확인하세요."
  );
};

const API_URL = getAPIURL();

interface Diary {
  diary_id: number;
  user_id: number;
  title: string;
  content: string;
  formatted_date: string;
  color: string;
}

export function UserView() {
  const table = useTable();
  const [diaryData, setDiaryData] = useState<Diary[]>([]); // Diary 데이터를 저장하는 상태
  const [filterName, setFilterName] = useState("");
  const user = useAuthStore((state) => state.user);

  // Diary 데이터를 API에서 가져오는 함수
  const fetchDiaryData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/diary/${user?.user_id}`); // 적절한 API 엔드포인트로 수정
      const data: Diary[] = await response.json();
      setDiaryData(data); // 상태에 저장
    } catch (error) {
      console.error(
        "다이어리 데이터를 가져오는 중 오류가 발생했습니다:",
        error
      );
    }
  };

  useEffect(() => {
    fetchDiaryData(); // 컴포넌트가 마운트될 때 데이터 가져오기
  }, []);

  // 테이블에서 사용할 데이터 필터링
  const dataFiltered = applyFilter({
    inputData: diaryData,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <DashboardContent>
      {/* 헤더 섹션 */}
      <Box 
        display="flex" 
        flexDirection={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        gap={2}
        mb={{ xs: 3, sm: 4 }}
      >
        <Box flexGrow={1}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
              fontWeight: 700,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {user?.profile_name}님의 무드 일기
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ color: "text.secondary", mt: 0.5 }}
          >
            총 {diaryData.length}개의 일기가 있어요
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
          href="/MgWriting"
          sx={{ 
            width: { xs: "100%", sm: "auto" },
            whiteSpace: "nowrap",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            boxShadow: "0 4px 14px rgba(102, 126, 234, 0.4)",
            borderRadius: 2,
            px: 3,
            py: 1,
            "&:hover": {
              background: "linear-gradient(135deg, #5a6fd6 0%, #6a4190 100%)",
              boxShadow: "0 6px 20px rgba(102, 126, 234, 0.5)",
            },
          }}
        >
          일기 쓰기
        </Button>
      </Box>

      {/* 테이블 카드 */}
      <Card 
        sx={{ 
          overflow: "hidden",
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <UserTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: "auto" }}>
            <Table sx={{ minWidth: { xs: 500, md: 700 } }}>
              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={diaryData.length}
                numSelected={table.selected.length}
                onSort={(id) => table.onSort(id as keyof Diary)}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    diaryData.map((diary) => String(diary.diary_id))
                  )
                }
                headLabel={[
                  { id: "title", label: "제목" },
                  { id: "content", label: "내용" },
                  { id: "color", label: "무드" },
                  { id: "formatted_date", label: "날짜" },
                  { id: "" },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row, index) => (
                    <UserTableRow
                      key={row.diary_id}
                      row={row}
                      selected={table.selected.includes(String(row.diary_id))}
                      onSelectRow={() =>
                        table.onSelectRow(String(row.diary_id))
                      }
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(
                    table.page,
                    table.rowsPerPage,
                    diaryData.length
                  )}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={diaryData.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          labelRowsPerPage="페이지당 행:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}`}
          sx={{
            borderTop: "1px solid",
            borderColor: "divider",
            ".MuiTablePagination-toolbar": {
              flexWrap: { xs: "wrap", sm: "nowrap" },
              justifyContent: { xs: "center", sm: "flex-end" },
              px: { xs: 1, sm: 2 },
              py: 1,
            },
            ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
            },
          }}
        />
      </Card>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

interface Diary {
  diary_id: number;
  user_id: number;
  title: string;
  content: string;
  formatted_date: string; // 날짜는 string으로 저장됨
  color: string;
}

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState<keyof Diary>("diary_id"); // 최신순 정렬 (ID 기준)
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<"asc" | "desc">("desc"); // 내림차순 (최신순)

  const onSort = useCallback(
    (id: keyof Diary) => {
      // id는 Diary 속성 중 하나여야 함
      const isAsc = orderBy === id && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback(
    (checked: boolean, newSelecteds: string[]) => {
      if (checked) {
        setSelected(newSelecteds);
        return;
      }
      setSelected([]);
    },
    []
  );

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
