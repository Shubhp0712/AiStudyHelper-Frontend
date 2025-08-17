import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

class PDFExportService {

    // Export flashcards as PDF
    async exportFlashcardsToPDF(flashcards, topic = 'Study Material') {
        try {
            console.log('Starting flashcard PDF export...');

            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 15;
            const contentWidth = pageWidth - (margin * 2);

            // Add title
            pdf.setFontSize(20);
            pdf.setFont('helvetica', 'bold');
            pdf.text(topic, margin, 25);

            // Add subtitle
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'normal');
            pdf.text(`${flashcards.length} Flashcards`, margin, 35);
            pdf.text(`Generated on ${new Date().toLocaleDateString()}`, margin, 42);

            let yPosition = 55;

            flashcards.forEach((card, index) => {
                // Check if we need a new page
                if (yPosition > pageHeight - 60) {
                    pdf.addPage();
                    yPosition = 25;
                }

                // Card number
                pdf.setFontSize(14);
                pdf.setFont('helvetica', 'bold');
                pdf.text(`Card ${index + 1}`, margin, yPosition);
                yPosition += 10;

                // Question
                pdf.setFontSize(12);
                pdf.setFont('helvetica', 'bold');
                pdf.text('Question:', margin, yPosition);
                yPosition += 7;

                pdf.setFont('helvetica', 'normal');
                const questionLines = pdf.splitTextToSize(card.question, contentWidth);
                pdf.text(questionLines, margin, yPosition);
                yPosition += questionLines.length * 5 + 5;

                // Answer
                pdf.setFont('helvetica', 'bold');
                pdf.text('Answer:', margin, yPosition);
                yPosition += 7;

                pdf.setFont('helvetica', 'normal');
                const answerLines = pdf.splitTextToSize(card.answer, contentWidth);
                pdf.text(answerLines, margin, yPosition);
                yPosition += answerLines.length * 5 + 15;

                // Add separator line
                if (index < flashcards.length - 1) {
                    pdf.setDrawColor(200, 200, 200);
                    pdf.line(margin, yPosition - 5, pageWidth - margin, yPosition - 5);
                }
            });

            // Save the PDF
            const fileName = `flashcards-${topic.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${Date.now()}.pdf`;
            pdf.save(fileName);

            console.log('Flashcard PDF exported successfully!');
            return true;

        } catch (error) {
            console.error('Error exporting flashcards to PDF:', error);
            throw error;
        }
    }

    // Export progress report as PDF
    async exportProgressToPDF(progressData, analytics) {
        try {
            console.log('Starting progress report PDF export...');

            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 15;
            const contentWidth = pageWidth - (margin * 2);

            let yPosition = 25;

            // Title
            pdf.setFontSize(24);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Study Progress Report', margin, yPosition);
            yPosition += 15;

            // Date
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'normal');
            pdf.text(`Generated on ${new Date().toLocaleDateString()}`, margin, yPosition);
            yPosition += 20;

            // Overall Statistics
            pdf.setFontSize(16);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Overall Statistics', margin, yPosition);
            yPosition += 10;

            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'normal');

            const stats = progressData.stats || {};
            const statsText = [
                `📚 Flashcards Learned: ${stats.totalFlashcardsLearned || 0}`,
                `📝 Quizzes Completed: ${stats.totalQuizzesTaken || 0}`,
                `📈 Average Quiz Score: ${Math.round(stats.averageQuizScore || 0)}%`,
                `⏱️ Total Study Time: ${this.formatTime(stats.totalStudyTime || 0)}`,
                `🔥 Current Streak: ${stats.currentStreak || 0} days`,
                `🏆 Longest Streak: ${stats.longestStreak || 0} days`
            ];

            statsText.forEach(stat => {
                pdf.text(stat, margin + 5, yPosition);
                yPosition += 7;
            });

            yPosition += 10;

            // Top Topics
            if (analytics?.topTopics && analytics.topTopics.length > 0) {
                pdf.setFontSize(16);
                pdf.setFont('helvetica', 'bold');
                pdf.text('Top Study Topics', margin, yPosition);
                yPosition += 10;

                pdf.setFontSize(12);
                pdf.setFont('helvetica', 'normal');

                analytics.topTopics.slice(0, 10).forEach((topic, index) => {
                    const topicText = `${index + 1}. ${topic.topic}`;
                    const activityText = `   ${topic.flashcardsCount} flashcards, ${topic.quizzesCount} quizzes`;
                    const scoreText = topic.averageScore > 0 ? ` (${Math.round(topic.averageScore)}% avg)` : '';

                    pdf.text(topicText, margin + 5, yPosition);
                    yPosition += 5;
                    pdf.text(activityText + scoreText, margin + 10, yPosition);
                    yPosition += 8;

                    if (yPosition > pageHeight - 40) {
                        pdf.addPage();
                        yPosition = 25;
                    }
                });

                yPosition += 10;
            }

            // Weekly Progress
            if (analytics?.weeklyProgress && analytics.weeklyProgress.length > 0) {
                // Check if we need a new page
                if (yPosition > pageHeight - 80) {
                    pdf.addPage();
                    yPosition = 25;
                }

                pdf.setFontSize(16);
                pdf.setFont('helvetica', 'bold');
                pdf.text('Weekly Progress', margin, yPosition);
                yPosition += 10;

                pdf.setFontSize(12);
                pdf.setFont('helvetica', 'normal');

                analytics.weeklyProgress.slice(0, 8).forEach(week => {
                    const weekText = `Week ${week.week}: ${week.studyDays} study days, ${week.totalSessions} sessions`;
                    pdf.text(weekText, margin + 5, yPosition);
                    yPosition += 6;
                });

                yPosition += 10;
            }

            // Recent Activity
            if (analytics?.recentActivity && analytics.recentActivity.length > 0) {
                // Check if we need a new page
                if (yPosition > pageHeight - 60) {
                    pdf.addPage();
                    yPosition = 25;
                }

                pdf.setFontSize(16);
                pdf.setFont('helvetica', 'bold');
                pdf.text('Recent Activity', margin, yPosition);
                yPosition += 10;

                pdf.setFontSize(10);
                pdf.setFont('helvetica', 'normal');

                analytics.recentActivity.slice(0, 15).forEach(activity => {
                    const date = new Date(activity.date).toLocaleDateString();
                    const type = activity.activityType.charAt(0).toUpperCase() + activity.activityType.slice(1);
                    const topic = activity.activityData.topic || 'General';

                    let activityText = `${date} - ${type}: ${topic}`;
                    if (activity.activityType === 'quiz' && activity.activityData.percentage) {
                        activityText += ` (${activity.activityData.percentage}%)`;
                    }

                    pdf.text(activityText, margin + 5, yPosition);
                    yPosition += 5;

                    if (yPosition > pageHeight - 30) {
                        pdf.addPage();
                        yPosition = 25;
                    }
                });
            }

            // Add footer
            const totalPages = pdf.internal.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                pdf.setPage(i);
                pdf.setFontSize(8);
                pdf.setFont('helvetica', 'normal');
                pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 30, pageHeight - 10);
                pdf.text('AI Study Assistant', margin, pageHeight - 10);
            }

            // Save the PDF
            const fileName = `progress-report-${Date.now()}.pdf`;
            pdf.save(fileName);

            console.log('Progress report PDF exported successfully!');
            return true;

        } catch (error) {
            console.error('Error exporting progress report to PDF:', error);
            throw error;
        }
    }

    // Export any component as PDF using html2canvas
    async exportComponentToPDF(elementId, fileName = 'export') {
        try {
            const element = document.getElementById(elementId);
            if (!element) {
                throw new Error(`Element with ID "${elementId}" not found`);
            }

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = 30;

            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
            pdf.save(`${fileName}-${Date.now()}.pdf`);

            return true;
        } catch (error) {
            console.error('Error exporting component to PDF:', error);
            throw error;
        }
    }

    // Helper function to format time
    formatTime(timeInMinutes) {
        if (timeInMinutes < 60) {
            return `${Math.round(timeInMinutes)}m`;
        } else if (timeInMinutes < 1440) {
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

export default new PDFExportService();
