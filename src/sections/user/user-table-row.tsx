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

      {/* 모달 컴포넌트 - 세련된 디자인 */}
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            margin: { xs: "8px", sm: "24px" },
            maxHeight: { xs: "calc(100% - 16px)", sm: "calc(100% - 48px)" },
            width: { xs: "calc(100% - 16px)", sm: "auto" },
            borderRadius: { xs: "16px", sm: "24px" },
            overflow: "hidden",
            background: "linear-gradient(180deg, #ffffff 0%, #faf8ff 100%)",
          },
          "& .MuiBackdrop-root": {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(4px)",
          },
          zIndex: 9999,
        }}
      >
        {/* 상단 컬러 바 */}
        <div
          style={{
            height: "6px",
            background: `linear-gradient(90deg, ${backgroundColor} 0%, ${backgroundColor}88 50%, ${backgroundColor} 100%)`,
          }}
        />

        {/* 헤더 */}
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: { xs: "16px", sm: "20px 24px" },
            borderBottom: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* 무드 컬러 인디케이터 */}
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                backgroundColor: backgroundColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 4px 12px ${backgroundColor}40`,
              }}
            >
              <span style={{ fontSize: "20px" }}>
                {row.color === "빨간색" && "😤"}
                {row.color === "노란색" && "😊"}
                {row.color === "파란색" && "😔"}
                {row.color === "초록색" && "😌"}
                {!["빨간색", "노란색", "파란색", "초록색"].includes(row.color) && "📝"}
              </span>
            </div>
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#1a1a2e",
                }}
              >
                {row.title}
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  color: "#888",
                  marginTop: "2px",
                }}
              >
                {row.formatted_date}
              </p>
            </div>
          </div>
          <IconButton
            onClick={handleCloseModal}
            sx={{
              backgroundColor: "rgba(0,0,0,0.04)",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.08)" },
            }}
          >
            <Iconify icon="eva:close-fill" width={20} />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            padding: { xs: "16px", sm: "24px" },
            overflowY: "auto",
          }}
        >
          {/* 일기 내용 카드 */}
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "16px",
              padding: "20px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              border: "1px solid rgba(0,0,0,0.06)",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "12px",
              }}
            >
              <Iconify icon="solar:document-text-bold" width={18} style={{ color: "#7551FF" }} />
              <span style={{ fontSize: "14px", fontWeight: 600, color: "#7551FF" }}>
                일기 내용
              </span>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: "15px",
                lineHeight: 1.8,
                color: "#333",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {row.content}
            </p>
          </div>

          {/* AI 분석 결과 카드 */}
          <div
            style={{
              background: "linear-gradient(135deg, #f8f5ff 0%, #f0ebff 100%)",
              borderRadius: "16px",
              padding: "20px",
              border: "1px solid rgba(117, 81, 255, 0.15)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #7551FF 0%, #9775FF 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Iconify icon="solar:magic-stick-3-bold" width={18} style={{ color: "#fff" }} />
              </div>
              <div>
                <span style={{ fontSize: "15px", fontWeight: 600, color: "#5a3fd6" }}>
                  AI 무디타의 편지
                </span>
                <p style={{ margin: 0, fontSize: "12px", color: "#8b7bc7" }}>
                  당신의 감정을 분석했어요
                </p>
              </div>
            </div>

            {emotionResult ? (
              <div
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  padding: "16px",
                  boxShadow: "0 2px 8px rgba(117, 81, 255, 0.08)",
                }}
              >
                {emotionResult.split("\n").map((line, index) => {
                  if (!line.trim()) return <br key={index} />;
                  
                  // 해시태그 처리
                  const parts = line.split(/(#[가-힣a-zA-Z0-9_]+)/g);
                  return (
                    <p
                      key={index}
                      style={{
                        margin: "0 0 8px 0",
                        fontSize: "14px",
                        lineHeight: 1.7,
                        color: "#444",
                      }}
                    >
                      {parts.map((part, i) =>
                        part.startsWith("#") ? (
                          <span
                            key={i}
                            style={{
                              display: "inline-block",
                              padding: "2px 8px",
                              margin: "0 2px",
                              borderRadius: "12px",
                              backgroundColor: `${backgroundColor}20`,
                              color: backgroundColor,
                              fontSize: "13px",
                              fontWeight: 500,
                            }}
                          >
                            {part}
                          </span>
                        ) : (
                          part
                        )
                      )}
                    </p>
                  );
                })}
              </div>
            ) : (
              <div
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  padding: "24px",
                  textAlign: "center",
                }}
              >
                <Iconify
                  icon="solar:letter-opened-linear"
                  width={40}
                  style={{ color: "#ccc", marginBottom: "8px" }}
                />
                <p style={{ margin: 0, fontSize: "14px", color: "#999" }}>
                  무디타에게 받은 편지가 없습니다
                </p>
              </div>
            )}
          </div>
        </DialogContent>

        <DialogActions
          sx={{
            padding: { xs: "12px 16px", sm: "16px 24px" },
            borderTop: "1px solid rgba(0,0,0,0.06)",
            gap: "12px",
          }}
        >
          <Button
            onClick={handleDelete}
            sx={{
              color: "#ff4d4f",
              fontSize: "14px",
              textTransform: "none",
              "&:hover": { backgroundColor: "rgba(255, 77, 79, 0.08)" },
            }}
            startIcon={<Iconify icon="solar:trash-bin-trash-bold" width={18} />}
          >
            삭제
          </Button>
          <Button
            onClick={handleCloseModal}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #7551FF 0%, #9775FF 100%)",
              color: "#fff",
              padding: { xs: "8px 20px", sm: "10px 28px" },
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "0 4px 12px rgba(117, 81, 255, 0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #6341e0 0%, #8866ee 100%)",
                boxShadow: "0 6px 16px rgba(117, 81, 255, 0.4)",
              },
            }}
          >
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
