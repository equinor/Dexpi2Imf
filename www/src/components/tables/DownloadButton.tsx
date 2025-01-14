import * as XLSX from "xlsx";
import {Button} from "@equinor/eds-core-react";

interface DownloadButtonProps {
  nodeIdsInside: string[];
  nodeIdsBoundary: string[];
  filename: string;
}

export default function DownloadButton({
  nodeIdsInside,
  nodeIdsBoundary,
  filename,
}: DownloadButtonProps) {
  const downloadWorkbook = () => {
    const wb = XLSX.utils.book_new();

    function createSheet(data: string[], header: string) {
      return XLSX.utils.json_to_sheet(data.map((id) => ({ [header]: id })));
    }
    XLSX.utils.book_append_sheet(
      wb,
      createSheet(nodeIdsInside, "Inside boundary"),
      "Inside Boundary",
    );
    XLSX.utils.book_append_sheet(
      wb,
      createSheet(nodeIdsBoundary, "Boundary"),
      "Boundary",
    );
    XLSX.utils.book_append_sheet(
      wb,
      createSheet([...nodeIdsInside, ...nodeIdsBoundary], "Combined"),
      "Combined",
    );

    XLSX.writeFile(wb, `${filename}.xlsx`, {
      bookType: "xlsx",
      type: "binary",
    });
  };

  return (
    <Button
      onClick={downloadWorkbook}
    >
      Download Excel
    </Button>
  );
}
