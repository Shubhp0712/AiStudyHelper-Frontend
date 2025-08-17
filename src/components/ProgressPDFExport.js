import React, { useState } from "react";
import pdfExportService from "./pdfExportService";

const ProgressPDFExport = ({ progress, analytics }) => {
    const [exporting, setExporting] = useState(false);

    const handleExport = async () => {
        if (!progress || !analytics) {
            alert('No progress data to export!');
            return;
        }

        try {
            setExporting(true);
            await pdfExportService.exportProgressToPDF(progress, analytics);
            alert('✅ Progress report exported to PDF successfully!');
        } catch (error) {
            console.error('Error exporting progress to PDF:', error);
            alert('❌ Failed to export progress report. Please try again.');
        } finally {
            setExporting(false);
        }
    };

    return (
        <button
            onClick={handleExport}
            disabled={exporting || !progress || !analytics}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${exporting || !progress || !analytics
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                }`}
            title="Export progress report as PDF"
        >
            {exporting ? (
                <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Exporting...</span>
                </>
            ) : (
                <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Export Progress Report</span>
                </>
            )}
        </button>
    );
};

export default ProgressPDFExport;
