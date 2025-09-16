import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas'; // Reserved for future chart export functionality

class PDFExportService {

    // Export flashcards as PDF with enhanced template
    async exportFlashcardsToPDF(flashcards, topic = 'Study Material') {
        try {
            console.log('Starting enhanced flashcard PDF export...');

            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 20;
            const contentWidth = pageWidth - (margin * 2);

            // Helper function to add page header
            const addPageHeader = (pageNum, totalPages) => {
                // Header background
                pdf.setFillColor(59, 130, 246); // Blue color
                pdf.rect(0, 0, pageWidth, 25, 'F');

                // Title
                pdf.setTextColor(255, 255, 255);
                pdf.setFontSize(16);
                pdf.setFont('helvetica', 'bold');
                pdf.text('AI Study Assistant - Flashcards', margin, 15);

                // Page number
                pdf.setFontSize(10);
                pdf.text(`Page ${pageNum} of ${totalPages}`, pageWidth - 40, 15);

                // Reset text color
                pdf.setTextColor(0, 0, 0);
            };

            // Calculate total pages needed
            let totalPages = 1;
            let currentY = 45;
            const cardHeight = 70;

            flashcards.forEach(() => {
                if (currentY + cardHeight > pageHeight - 30) {
                    totalPages++;
                    currentY = 45;
                }
                currentY += cardHeight + 15;
            });

            // First page header
            addPageHeader(1, totalPages);

            // Topic and metadata
            pdf.setFontSize(14);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(51, 51, 51);
            pdf.text(`Topic: ${topic}`, margin, 35);

            pdf.setFontSize(11);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(102, 102, 102);
            pdf.text(`Generated: ${new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })}`, margin, 42);
            pdf.text(`Total Cards: ${flashcards.length}`, pageWidth - 60, 42);

            let yPosition = 55;
            let currentPage = 1;

            flashcards.forEach((card, index) => {
                // Check if we need a new page
                if (yPosition + cardHeight > pageHeight - 30) {
                    pdf.addPage();
                    currentPage++;
                    addPageHeader(currentPage, totalPages);
                    yPosition = 45;
                }

                // Card container with shadow effect
                pdf.setFillColor(248, 250, 252); // Light gray background
                pdf.setDrawColor(226, 232, 240); // Border color
                pdf.setLineWidth(0.5);
                pdf.roundedRect(margin, yPosition, contentWidth, cardHeight, 3, 3, 'FD');

                // Card number badge
                pdf.setFillColor(34, 197, 94); // Green color
                pdf.roundedRect(margin + 5, yPosition + 5, 25, 10, 2, 2, 'F');
                pdf.setTextColor(255, 255, 255);
                pdf.setFontSize(8);
                pdf.setFont('helvetica', 'bold');
                pdf.text(`${index + 1}`, margin + 12, yPosition + 12);

                // Question section
                pdf.setTextColor(30, 41, 59);
                pdf.setFontSize(11);
                pdf.setFont('helvetica', 'bold');
                pdf.text('Question:', margin + 8, yPosition + 25);

                pdf.setFont('helvetica', 'normal');
                pdf.setTextColor(51, 65, 85);
                const questionLines = pdf.splitTextToSize(card.question || 'No question provided', contentWidth - 20);
                pdf.text(questionLines, margin + 8, yPosition + 32);

                const questionHeight = questionLines.length * 4;

                // Answer section
                pdf.setFont('helvetica', 'bold');
                pdf.setTextColor(30, 41, 59);
                pdf.text('Answer:', margin + 8, yPosition + 40 + questionHeight);

                pdf.setFont('helvetica', 'normal');
                pdf.setTextColor(51, 65, 85);
                const answerLines = pdf.splitTextToSize(card.answer || 'No answer provided', contentWidth - 20);
                pdf.text(answerLines, margin + 8, yPosition + 47 + questionHeight);

                yPosition += cardHeight + 15;
            });

            // Add footer to all pages
            for (let i = 1; i <= totalPages; i++) {
                pdf.setPage(i);
                pdf.setFontSize(8);
                pdf.setFont('helvetica', 'normal');
                pdf.setTextColor(102, 102, 102);
                pdf.text('Generated by AI Study Assistant', margin, pageHeight - 10);
                pdf.text(new Date().toISOString().split('T')[0], pageWidth - 40, pageHeight - 10);
            }

            // Save the PDF
            const fileName = `${topic.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_flashcards.pdf`;
            pdf.save(fileName);
            console.log('Enhanced flashcard PDF exported successfully');

        } catch (error) {
            console.error('Error exporting flashcards to PDF:', error);
            throw error;
        }
    }

    // Export progress report as PDF with enhanced template
    async exportProgressToPDF(progressData, analytics) {
        try {
            console.log('Starting enhanced progress PDF export...');
            console.log('Progress data:', progressData);
            console.log('Analytics data:', analytics);

            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 20;
            const contentWidth = pageWidth - (margin * 2);

            // Helper function to add page header
            const addPageHeader = (pageNum, totalPages, title = 'Study Progress Report') => {
                // Header background gradient effect
                pdf.setFillColor(34, 197, 94); // Green color
                pdf.rect(0, 0, pageWidth, 30, 'F');

                // Title
                pdf.setTextColor(255, 255, 255);
                pdf.setFontSize(18);
                pdf.setFont('helvetica', 'bold');
                pdf.text(title, margin, 20);

                // Page number
                pdf.setFontSize(10);
                pdf.text(`Page ${pageNum} of ${totalPages}`, pageWidth - 40, 20);

                // Reset text color
                pdf.setTextColor(0, 0, 0);
            };

            // Helper function to add section header
            const addSectionHeader = (title, icon, yPos) => {
                pdf.setFillColor(241, 245, 249); // Light blue-gray
                pdf.roundedRect(margin, yPos, contentWidth, 12, 2, 2, 'F');
                pdf.setTextColor(30, 41, 59);
                pdf.setFontSize(14);
                pdf.setFont('helvetica', 'bold');
                pdf.text(`${icon} ${title}`, margin + 5, yPos + 8);
                return yPos + 20;
            };

            // Helper function to add stat box
            const addStatBox = (label, value, x, y, width = 40, height = 25) => {
                // Box background
                pdf.setFillColor(255, 255, 255);
                pdf.setDrawColor(226, 232, 240);
                pdf.setLineWidth(0.5);
                pdf.roundedRect(x, y, width, height, 2, 2, 'FD');

                // Value
                pdf.setTextColor(59, 130, 246);
                pdf.setFontSize(16);
                pdf.setFont('helvetica', 'bold');
                const valueText = String(value);
                const valueWidth = pdf.getTextWidth(valueText);
                pdf.text(valueText, x + (width - valueWidth) / 2, y + 12);

                // Label
                pdf.setTextColor(100, 116, 139);
                pdf.setFontSize(8);
                pdf.setFont('helvetica', 'normal');
                const labelWidth = pdf.getTextWidth(label);
                pdf.text(label, x + (width - labelWidth) / 2, y + 20);
            };

            // Start creating the PDF
            addPageHeader(1, 1);

            // Report metadata
            let yPosition = 40;
            pdf.setFontSize(11);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(100, 116, 139);
            pdf.text(`Generated: ${new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })}`, margin, yPosition);

            // Extract stats from progress data with fallbacks
            const stats = progressData?.stats || {};
            const progressStats = progressData?.progress || progressData || {};

            // Create comprehensive stats object with proper fallbacks
            const displayStats = {
                totalFlashcardsLearned: stats.totalFlashcardsLearned || progressStats.totalFlashcardsLearned || 0,
                totalQuizzesTaken: stats.totalQuizzesTaken || progressStats.totalQuizzesTaken || 0,
                averageQuizScore: stats.averageQuizScore || progressStats.averageQuizScore || 0,
                totalStudyTime: stats.totalStudyTime || progressStats.totalStudyTime || 0,
                currentStreak: stats.currentStreak || progressStats.currentStreak || 0,
                longestStreak: stats.longestStreak || progressStats.longestStreak || 0,
                totalSessions: stats.totalSessions || progressStats.totalSessions || 0,
                topicsStudied: stats.topicsStudied || progressStats.topicsStudied || []
            };

            yPosition += 15;

            // Overview Statistics Section
            yPosition = addSectionHeader('Overview Statistics', '[STATS]', yPosition);

            // Stats grid (2x3)
            const statBoxWidth = (contentWidth - 10) / 3;
            const statBoxHeight = 25;
            const statsRow1Y = yPosition;
            const statsRow2Y = yPosition + 35;

            addStatBox('Flashcards\nLearned', displayStats.totalFlashcardsLearned, margin, statsRow1Y, statBoxWidth);
            addStatBox('Quizzes\nTaken', displayStats.totalQuizzesTaken, margin + statBoxWidth + 5, statsRow1Y, statBoxWidth);
            addStatBox('Study Time\n(hours)', Math.round(displayStats.totalStudyTime / 60 * 10) / 10, margin + (statBoxWidth + 5) * 2, statsRow1Y, statBoxWidth);

            addStatBox('Current\nStreak (days)', displayStats.currentStreak, margin, statsRow2Y, statBoxWidth);
            addStatBox('Best Streak\n(days)', displayStats.longestStreak, margin + statBoxWidth + 5, statsRow2Y, statBoxWidth);
            addStatBox('Avg Quiz\nScore (%)', Math.round(displayStats.averageQuizScore), margin + (statBoxWidth + 5) * 2, statsRow2Y, statBoxWidth);

            yPosition = statsRow2Y + 40;

            // Topics Studied Section
            if (Array.isArray(displayStats.topicsStudied) && displayStats.topicsStudied.length > 0) {
                if (yPosition > pageHeight - 80) {
                    pdf.addPage();
                    addPageHeader(2, 2);
                    yPosition = 40;
                }

                yPosition = addSectionHeader('Topics Studied', '[TOPICS]', yPosition);

                pdf.setFontSize(10);
                pdf.setFont('helvetica', 'normal');
                pdf.setTextColor(51, 65, 85);

                displayStats.topicsStudied.slice(0, 10).forEach((topicData, index) => {
                    if (yPosition > pageHeight - 30) {
                        pdf.addPage();
                        addPageHeader(2, 2);
                        yPosition = 40;
                    }

                    const topicName = typeof topicData === 'string' ? topicData :
                        (topicData?.topic || topicData?.name || `Topic ${index + 1}`);
                    const flashcardCount = topicData?.flashcardsCount || 0;
                    const quizCount = topicData?.quizzesCount || 0;

                    // Topic row background
                    if (index % 2 === 0) {
                        pdf.setFillColor(249, 250, 251);
                        pdf.rect(margin, yPosition - 3, contentWidth, 8, 'F');
                    }

                    pdf.text(`• ${topicName}`, margin + 5, yPosition + 2);
                    if (flashcardCount > 0 || quizCount > 0) {
                        pdf.setTextColor(100, 116, 139);
                        pdf.text(`(${flashcardCount} cards, ${quizCount} quizzes)`, pageWidth - 80, yPosition + 2);
                        pdf.setTextColor(51, 65, 85);
                    }
                    yPosition += 8;
                });

                yPosition += 10;
            }

            // Recent Activity Section
            if (analytics?.recentActivity && Array.isArray(analytics.recentActivity) && analytics.recentActivity.length > 0) {
                if (yPosition > pageHeight - 80) {
                    pdf.addPage();
                    addPageHeader(2, 2);
                    yPosition = 40;
                }

                yPosition = addSectionHeader('Recent Activity', '[ACTIVITY]', yPosition);

                pdf.setFontSize(9);
                pdf.setFont('helvetica', 'normal');

                analytics.recentActivity.slice(0, 15).forEach((activity, index) => {
                    if (yPosition > pageHeight - 25) {
                        pdf.addPage();
                        addPageHeader(3, 3);
                        yPosition = 40;
                    }

                    const date = activity.date ? new Date(activity.date).toLocaleDateString() : 'N/A';
                    const type = activity.activityType ?
                        activity.activityType.charAt(0).toUpperCase() + activity.activityType.slice(1) : 'Unknown';

                    let topic = 'General';
                    let details = '';

                    if (activity.activityData) {
                        if (typeof activity.activityData === 'string') {
                            topic = activity.activityData;
                        } else {
                            topic = activity.activityData.topic || 'General';
                            if (type === 'Quiz' && activity.activityData.percentage) {
                                details = ` (${activity.activityData.percentage}%)`;
                            }
                        }
                    }

                    // Activity row background
                    if (index % 2 === 0) {
                        pdf.setFillColor(249, 250, 251);
                        pdf.rect(margin, yPosition - 3, contentWidth, 7, 'F');
                    }

                    pdf.setTextColor(51, 65, 85);
                    pdf.text(`${date}:`, margin + 5, yPosition + 2);
                    pdf.setTextColor(59, 130, 246);
                    pdf.text(type, margin + 35, yPosition + 2);
                    pdf.setTextColor(51, 65, 85);
                    pdf.text(`- ${topic}${details}`, margin + 60, yPosition + 2);

                    yPosition += 7;
                });
            }

            // Add footer
            pdf.setPage(pdf.getNumberOfPages());
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(100, 116, 139);
            pdf.text('Generated by AI Study Assistant', margin, pageHeight - 10);
            pdf.text(`Report ID: ${Date.now().toString(36)}`, pageWidth - 60, pageHeight - 10);

            // Save the PDF
            const fileName = `progress-report-${new Date().toISOString().split('T')[0]}-${Date.now()}.pdf`;
            pdf.save(fileName);

            console.log('Enhanced progress PDF exported successfully');

        } catch (error) {
            console.error('Error exporting progress to PDF:', error);
            throw error;
        }
    }

    // Helper method to format time
    formatTime(timeInMinutes) {
        if (!timeInMinutes || timeInMinutes === 0) return '0 minutes';

        if (timeInMinutes < 60) {
            return `${Math.round(timeInMinutes)} minutes`;
        } else if (timeInMinutes < 1440) { // less than 24 hours
            const hours = Math.floor(timeInMinutes / 60);
            const minutes = Math.round(timeInMinutes % 60);
            return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
        } else {
            const days = Math.floor(timeInMinutes / 1440);
            const hours = Math.floor((timeInMinutes % 1440) / 60);
            return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
        }
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
const pdfService = new PDFExportService();
export default pdfService;
