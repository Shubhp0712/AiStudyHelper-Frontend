import React, { useState } from "react";
import { toast } from 'react-toastify';
import pdfExportService from "./pdfExportService";

const FlashcardPDFExport = ({ flashcards, topic }) => {
    const [exporting, setExporting] = useState(false);

    const handleExport = async () => {
        if (!flashcards || flashcards.length === 0) {
            toast.error('No flashcards to export!');
            return;
        }

        try {
            setExporting(true);
            await pdfExportService.exportFlashcardsToPDF(flashcards, topic || 'Study Material');
            toast.success('Flashcards exported to PDF successfully!', {
                icon: '🗂️',
                className: 'toast-pdf-success',
                progressClassName: 'toast-progress-success',
                autoClose: 4000,
            });
        } catch (error) {
            console.error('Error exporting to PDF:', error);
            toast.error('Failed to export flashcards PDF. Please try again.', {
                className: 'toast-pdf-error',
                progressClassName: 'toast-progress-error',
                autoClose: 5000,
            });
        } finally {
            setExporting(false);
        }
    };

    return (
        <button
            onClick={handleExport}
            disabled={exporting || !flashcards || flashcards.length === 0}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${exporting || !flashcards || flashcards.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                }`}
            title="Export flashcards as PDF"
        >
            {exporting ? (
                <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Exporting...</span>
                </>
            ) : (
                <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Export PDF</span>
                </>
            )}
        </button>
    );
};

export default FlashcardPDFExport;
