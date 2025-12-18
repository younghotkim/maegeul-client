import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import Popover from "@mui/material/Popover";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import MenuList from "@mui/material/MenuList";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import MenuItem, { menuItemClasses } from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog"; // 모달 컴포넌트
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import axios from "axios"; // Emotion 데이터를 가져오기 위해 Axios 사용

import { Iconify } from "../../dashboardComponents/iconify";

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

// Diary 타입 정의
interface Diary {
  diary_id: number;
  user_id: number;
  title: string;
  content: string;
  formatted_date: string;
  color: string;
}

type UserTableRowProps = {
  row: Diary; // Diary 타입으로 변경
  selected: boolean;
  onSelectRow: () => void;
};

export function UserTableRow({
  row,
  selected,
  onSelectRow,
}: UserTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(
    null
  );

  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emotionResult, setEmotionResult] = useState<string | null>(null);
  // 모달 열기
  const handleContentClick = async () => {
    setIsModalOpen(true);

    // 다이어리 ID를 기반으로 감정 분석 결과 불러오기
    try {
      const response = await axios.get(
        `${API_URL}/api/emotion/${row.diary_id}`
      );

      // 데이터는 이미 문자열 형태이므로 JSON.parse() 필요 없음
      const emotionResult =
        response.data.emotionReport || "무디타에게 받은 편지가 없습니다.";

      setEmotionResult(emotionResult);
    } catch (error) {
      setEmotionResult("무디타에게 받은 편지가 없습니다.");
      console.error("Error fetching emotion result:", error); // 에러 로그 출력
    }
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEmotionResult(null); // 모달이 닫힐 때 감정 결과 초기화
  };

  const handleOpenPopover = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setOpenPopover(event.currentTarget);
    },
    []
  );

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleDelete = async () => {
    const confirmDelete = window.confirm("정말 이 일기를 삭제하시겠습니까?");

    if (!confirmDelete) return; // 사용자가 취소한 경우

    try {
      const response = await axios.delete(
        `${API_URL}/api/diary/delete/${row.diary_id}`
      );

      if (response.status === 200) {
        alert("일기가 성공적으로 삭제되었습니다.");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error deleting diary:", error);
      alert("일기 삭제 중 오류가 발생했습니다.");
    }
  };

  const colorMap: { [key: string]: string } = {
    빨간색: "#EE5D50",
    노란색: "#FFDE57",
    파란색: "#6AD2FF",
    초록색: "#35D28A",
  };

  // diaryData.color 텍스트를 컬러 코드로 변환
  const backgroundColor = colorMap[row.color] || "#FFFFFF"; // row.color가 전달되도록 수정

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        {/* Diary의 title 필드를 테이블에 표시 */}
        <TableCell component="th" scope="row">
          {row.title}
        </TableCell>

        {/* Diary의 content 필드를 테이블에 표시 */}
        <TableCell
          style={{ cursor: "pointer" }} // 포인터 스타일 적용
          onClick={handleContentClick} // 클릭 시 모달을 여는 함수
        >
          {row.content.length > 50
            ? row.content.slice(0, 20) + "... "
            : row.content}
        </TableCell>

        {/* Diary의 date 필드를 테이블에 표시 */}
        {/* color 필드를 배경색으로 표시 */}
        <TableCell>
          <span
            style={{
              display: "inline-block",
              width: "30px",
              height: "30px",
              backgroundColor: backgroundColor, // 매핑된 색상 코드 적용
              borderRadius: "50%", // 원형으로 표시 (원형 말고 사각형으로 하려면 이 부분을 제거)
            }}
          />
        </TableCell>

        {/* Diary의 date 필드를 테이블에 표시 */}
        <TableCell>{row.formatted_date}</TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: "flex",
            flexDirection: "column",
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: "action.selected" },
            },
          }}
        >
          {/* <MenuItem onClick={handleClosePopover}>
            <Iconify icon="solar:pen-bold" />
            수정하기
          </MenuItem> */}

          <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            삭제하기
          </MenuItem>
        </MenuList>
      </Popover>

      {/* 모달 컴포넌트 */}
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          style={{
            fontFamily: "font-plus-jakarta-sans",
            fontSize: "24px",
            textAlign: "center",
            color: "#7551FF",
            paddingBottom: "10px",
            fontWeight: "bold",
          }}
        >
          📝 무드 일기
        </DialogTitle>

        <DialogContent
          dividers
          style={{
            backgroundColor: "#f4f0ff",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(117, 81, 255, 0.2)",
          }}
        >
          <div
            style={{
              border: "2px solid #7551FF",
              padding: "15px",
              backgroundColor: "#fff",
              borderRadius: "8px",
            }}
          >
            <h3
              style={{
                fontFamily: "font-plus-jakarta-sans",
                fontSize: "20px",
                color: "#7551FF",
                marginBottom: "15px",
                fontWeight: "bold",
              }}
            >
              제목: {row.title}
            </h3>

            {/* 내용 부분 */}
            <h2
              style={{
                fontFamily: "font-plus-jakarta-sans",
                fontSize: "18px",
                color: "#333",
                lineHeight: "1.6",
                padding: "10px 0",
                backgroundColor: "#fafafa",
                borderRadius: "8px",
              }}
            >
              {row.content}
            </h2>

            {/* 감정 분석 결과 부분 */}
            <h4
              style={{
                fontFamily: "font-plus-jakarta-sans",
                fontSize: "20px",
                color: "#7551FF",
                marginBottom: "15px",
                fontWeight: "bold",
              }}
            >
              💌 무디타의 편지:
            </h4>
            <p>{emotionResult}</p>
          </div>
        </DialogContent>

        <DialogActions style={{ justifyContent: "center", padding: "20px" }}>
          <Button
            onClick={handleCloseModal}
            style={{
              backgroundColor: "#7551FF",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "12px",
              fontFamily: "font-plus-jakarta-sans",
              fontSize: "16px",
              boxShadow: "0 4px 6px rgba(117, 81, 255, 0.3)",
              textTransform: "none",
            }}
          >
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
