import {
  _id,
  _price,
  _times,
  _company,
  _boolean,
  _fullName,
  _taskNames,
  _postTitles,
  _description,
  _productNames,
} from "./_mock";

// ----------------------------------------------------------------------

export const _myAccount = {
  displayName: "Jaydon Frankie",
  email: "demo@minimals.cc",
  photoURL: "/assets/images/avatar/avatar-25.webp",
};

// ----------------------------------------------------------------------

export const _users = [...Array(24)].map((_, index) => ({
  id: _id(index),
  name: _fullName(index),
  company: _company(index),
  isVerified: _boolean(index),
  avatarUrl: `/assets/images/avatar/avatar-${index + 1}.webp`,
  status: index % 4 ? "active" : "banned",
  role:
    [
      "Leader",
      "Hr Manager",
      "UI Designer",
      "UX Designer",
      "UI/UX Designer",
      "Project Manager",
      "Backend Developer",
      "Full Stack Designer",
      "Front End Developer",
      "Full Stack Developer",
    ][index] || "UI Designer",
}));

// ----------------------------------------------------------------------

export const _posts = [...Array(23)].map((_, index) => ({
  id: _id(index),
  title: _postTitles(index),
  description: _description(index),
  coverUrl: `/assets/images/cover/cover-${index + 1}.webp`,
  totalViews: 8829,
  totalComments: 7977,
  totalShares: 8556,
  totalFavorites: 8870,
  postedAt: _times(index),
  author: {
    name: _fullName(index),
    avatarUrl: `/assets/images/avatar/avatar-${index + 1}.webp`,
  },
}));

// ----------------------------------------------------------------------

const COLORS = [
  "#00AB55",
  "#000000",
  "#FFFFFF",
  "#FFC0CB",
  "#FF4842",
  "#1890FF",
  "#94D82D",
  "#FFC107",
];

export const _products = [...Array(24)].map((_, index) => {
  const setIndex = index + 1;

  return {
    id: _id(index),
    price: _price(index),
    name: _productNames(index),
    priceSale: setIndex % 3 ? null : _price(index),
    coverUrl: `/assets/images/product/product-${setIndex}.webp`,
    colors:
      (setIndex === 1 && COLORS.slice(0, 2)) ||
      (setIndex === 2 && COLORS.slice(1, 3)) ||
      (setIndex === 3 && COLORS.slice(2, 4)) ||
      (setIndex === 4 && COLORS.slice(3, 6)) ||
      (setIndex === 23 && COLORS.slice(4, 6)) ||
      (setIndex === 24 && COLORS.slice(5, 6)) ||
      COLORS,
    status:
      ([1, 3, 5].includes(setIndex) && "sale") ||
      ([4, 8, 12].includes(setIndex) && "new") ||
      "",
  };
});

// ----------------------------------------------------------------------

export const _langs = [
  {
    value: "kr",
    label: "Korean",
    icon: "/assets/icons/flags/ic-flag-kr.svg",
  },
  {
    value: "de",
    label: "English",
    icon: "/assets/icons/flags/ic-flag-en.svg",
  },
  {
    value: "fr",
    label: "French",
    icon: "/assets/icons/flags/ic-flag-fr.svg",
  },
];

// ----------------------------------------------------------------------

export const _timeline = [...Array(5)].map((_, index) => ({
  id: _id(index),
  title: ["파란색", "초록색", "파란색", "노란색", "빨간색"][index],
  type: `order${index + 1}`,
  time: _times(index),
}));

// ----------------------------------------------------------------------

export const _tasks = [...Array(5)].map((_, index) => ({
  id: _id(index),
  name: _taskNames(index),
}));

// ----------------------------------------------------------------------

export const _notifications = [
  {
    id: _id(1),
    title: "무드 일기 작성이 3일 경과됐습니다!",
    description: "무드 일기를 작성해주세요.",
    avatarUrl: null,
    type: "order-placed",
    postedAt: _times(1),
    isUnRead: true,
  },
  {
    id: _id(2),
    title: "새로운 컨텐츠가 추가됐습니다!",
    description: "추천 컨텐츠 탭에서 확인해주세요.",
    avatarUrl: "/assets/images/avatar/avatar-2.webp",
    type: "friend-interactive",
    postedAt: _times(2),
    isUnRead: true,
  },
  {
    id: _id(3),
    title: "긍정 감정이 급증했습니다!",
    description: "긍정 감정을 유지해주세요.",
    avatarUrl: null,
    type: "chat-message",
    postedAt: _times(3),
    isUnRead: false,
  },
  {
    id: _id(4),
    title: "무드 일기 작성이 5일 경과됐습니다!",
    description: "무드 일기를 작성해주세요.",
    avatarUrl: null,
    type: "mail",
    postedAt: _times(4),
    isUnRead: false,
  },
  {
    id: _id(5),
    title: "무드 일기 작성이 6일 경과됐습니다!",
    description: "무드 일기를 작성해주세요.",
    avatarUrl: null,
    type: "order-shipped",
    postedAt: _times(5),
    isUnRead: false,
  },
];
