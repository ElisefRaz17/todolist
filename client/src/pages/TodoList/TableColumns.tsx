import { GridRenderCellParams } from "@mui/x-data-grid";
import { format, parseISO } from "date-fns";
import dayjs from "dayjs";

export const statusColumn = {
  field: "status",
  headerName: "Status",
  type: "string",
  width: 70,
  editable: true,
};
export const deadlineColumn = {
  field: "deadline",
  headerName: "Deadline",
  type: "date",
  width: 120,
  valueFormatter: (params: any) => {
    if (!params.value) {
      return "";
    }

    try {
      const parsedDate = parseISO(params.value);
      return format(parsedDate, "yyyy-MM-dd");
    } catch (error) {
      console.error("Error parsing date:", error);
      return "Invalid Date";
    }
  },
  renderCell: (params: GridRenderCellParams) => {
    return dayjs(params.value).format("YYYY-MM-DD"); // Format the date as needed
  },
  editable: true,
};

export const nameColumn = {
  field: "name",
  headerName: "Name",
  type: "string",
  width: 130,
  editable: true,
};

export const descriptionColumn={
    field: "description",
    headerName: "Description",
    type: "string",
    width: 130,
    editable: true,
}
