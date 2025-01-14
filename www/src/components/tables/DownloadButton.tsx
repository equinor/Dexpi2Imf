import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

// @ts-ignore
const DownloadButton = ({ nodeIdsInside, nodeIdsBoundary, filename }) => {
    const downloadWorkbook = () => {
        const wb = XLSX.utils.book_new();

        const wsInside = XLSX.utils.json_to_sheet(nodeIdsInside.map((id: any) => ({ 'Inside boundary': id })));
        XLSX.utils.book_append_sheet(wb, wsInside, 'Inside Boundary');

        const wsBoundary = XLSX.utils.json_to_sheet(nodeIdsBoundary.map((id: any) => ({ 'Boundary': id })));
        XLSX.utils.book_append_sheet(wb, wsBoundary, 'Boundary');

        const combinedData = nodeIdsInside.concat(nodeIdsBoundary);
        const wsCombined = XLSX.utils.json_to_sheet(combinedData.map((id: any) => ({ 'Combined': id })));
        XLSX.utils.book_append_sheet(wb, wsCombined, 'Combined');

        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

        const s2ab = (s: string) => {
            const buffer = new ArrayBuffer(s.length);
            const view = new Uint8Array(buffer);
            for (let i = 0; i < s.length; i++) {
                view[i] = s.charCodeAt(i) & 0xFF;
            }
            return buffer;
        };

        saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), filename);
    };

    return (
        <button onClick={downloadWorkbook} style={{ margin: '10px', padding: '5px 10px', cursor: 'pointer' }}>
            Download Excel
        </button>
    );
};

export default DownloadButton;