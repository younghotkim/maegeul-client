import { Iconify } from "../dashboardComponents/iconify";

// ----------------------------------------------------------------------

export const navData = [
  {
    title: "홈",
    path: "/",
    icon: <Iconify icon="ion:home" width={24} />,
  },
  {
    title: "대시보드",
    path: "/dashboard",
    icon: <Iconify icon="ic:baseline-dashboard" width={24} />,
  },
  {
    title: "일기장",
    path: "/diary",
    icon: <Iconify icon="tabler:writing" width={24} />,
  },
  {
    title: "추천 컨텐츠",
    path: "/contents",
    icon: <Iconify icon="oui:table-of-contents" width={24} />,
  },
  {
    title: "매일 글쓰기",
    path: "/maegeul",
    icon: <Iconify icon="mdi:pencil" width={24} />,
  },
];
