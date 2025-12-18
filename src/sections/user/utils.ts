// ----------------------------------------------------------------------

export const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: "1px",
  height: "1px",
  overflow: "hidden",
  position: "absolute",
  whiteSpace: "nowrap",
  clip: "rect(0 0 0 0)",
} as const;

// ----------------------------------------------------------------------

export function emptyRows(
  page: number,
  rowsPerPage: number,
  arrayLength: number
) {
  return page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

// ----------------------------------------------------------------------

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (a[orderBy] < b[orderBy]) {
    return -1;
  }
  if (a[orderBy] > b[orderBy]) {
    return 1;
  }
  return 0;
}

// ----------------------------------------------------------------------

interface Diary {
  diary_id: number;
  user_id: number;
  title: string;
  content: string;
  formatted_date: string; // 날짜는 string 형태로 저장될 수 있습니다 (API에서 JSON으로 받을 경우)
  color: string;
}

export function getComparator<Key extends keyof Diary>(
  order: "asc" | "desc",
  orderBy: Key
): (a: Diary, b: Diary) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// ----------------------------------------------------------------------

interface ApplyFilterProps<T> {
  inputData: T[];
  comparator: (a: T, b: T) => number;
  filterName: string;
}

// title로 필터링하는 함수
export function applyFilter({
  inputData,
  comparator,
  filterName,
}: ApplyFilterProps<Diary>) {
  // 먼저 inputData가 배열인지 확인합니다
  if (!Array.isArray(inputData)) {
    console.error("inputData는 배열이어야 합니다.", inputData);
    return [];
  }

  let filteredData = inputData;

  // 필터링 로직이 있으면 수행
  if (filterName) {
    filteredData = inputData.filter(
      (item) =>
        item.title.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  // 정렬 수행
  return filteredData.sort(comparator);
}
