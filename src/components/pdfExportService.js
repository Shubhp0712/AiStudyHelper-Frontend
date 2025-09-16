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
            console.log('Starting completely redesigned progress PDF export...');
            console.log('Progress data:', progressData);
            console.log('Analytics data:', analytics);

            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 15;
            const contentWidth = pageWidth - (margin * 2);

            // Modern color palette
            const colors = {
                primary: [24, 90, 219],        // Deep blue
                secondary: [99, 102, 241],     // Indigo
                accent: [16, 185, 129],        // Emerald
                warning: [245, 158, 11],       // Amber
                danger: [239, 68, 68],         // Red
                success: [34, 197, 94],        // Green
                dark: [15, 23, 42],            // Slate 900
                light: [248, 250, 252],        // Slate 50
                medium: [100, 116, 139]        // Slate 500
            };

            // Enhanced helper function for modern page header
            const addModernPageHeader = (pageNum, totalPages) => {
                // Gradient background simulation
                for (let i = 0; i < 40; i++) {
                    const alpha = 1 - (i / 40) * 0.3;
                    const r = colors.primary[0] + (colors.secondary[0] - colors.primary[0]) * (i / 40);
                    const g = colors.primary[1] + (colors.secondary[1] - colors.primary[1]) * (i / 40);
                    const b = colors.primary[2] + (colors.secondary[2] - colors.primary[2]) * (i / 40);
                    pdf.setFillColor(r, g, b);
                    pdf.rect(0, i, pageWidth, 1, 'F');
                }

                // Header content overlay
                pdf.setFillColor(255, 255, 255, 0.1);
                pdf.rect(0, 0, pageWidth, 40, 'F');

                // Company logo placeholder (geometric design)
                pdf.setFillColor(255, 255, 255);
                pdf.circle(margin + 8, 15, 6, 'F');
                pdf.setFillColor(...colors.accent);
                pdf.circle(margin + 8, 15, 4, 'F');

                // Modern title typography
                pdf.setTextColor(255, 255, 255);
                pdf.setFontSize(22);
                pdf.setFont('helvetica', 'bold');
                pdf.text('STUDY ANALYTICS', margin + 20, 18);

                pdf.setFontSize(11);
                pdf.setFont('helvetica', 'normal');
                pdf.text('Personal Progress Report', margin + 20, 25);

                // Page indicator with modern design
                pdf.setFillColor(255, 255, 255, 0.2);
                pdf.roundedRect(pageWidth - 60, 8, 45, 15, 7.5, 7.5, 'F');
                pdf.setTextColor(255, 255, 255);
                pdf.setFontSize(10);
                pdf.setFont('helvetica', 'bold');
                pdf.text(`${pageNum} / ${totalPages}`, pageWidth - 45, 17);

                // Modern divider line
                pdf.setDrawColor(...colors.accent);
                pdf.setLineWidth(2);
                pdf.line(0, 40, pageWidth, 40);
            };

            // Advanced section header with modern design
            const addPremiumSectionHeader = (title, icon, yPos, color = colors.primary) => {
                // Section background with subtle gradient
                pdf.setFillColor(...colors.light);
                pdf.roundedRect(margin, yPos, contentWidth, 20, 4, 4, 'F');

                // Accent border
                pdf.setFillColor(...color);
                pdf.roundedRect(margin, yPos, 6, 20, 3, 3, 'F');

                // Icon background circle
                pdf.setFillColor(...color);
                pdf.circle(margin + 15, yPos + 10, 8, 'F');

                // Icon (using centered text)
                pdf.setTextColor(255, 255, 255);
                pdf.setFontSize(7);
                pdf.setFont('helvetica', 'bold');
                const iconWidth = pdf.getTextWidth(icon);
                pdf.text(icon, margin + 15 - (iconWidth / 2), yPos + 12);

                // Section title
                pdf.setTextColor(...colors.dark);
                pdf.setFontSize(16);
                pdf.setFont('helvetica', 'bold');
                pdf.text(title.toUpperCase(), margin + 30, yPos + 13);

                return yPos + 30;
            };

            // Premium stat card design
            const addPremiumStatCard = (label, value, x, y, width = 50, height = 40, color = colors.primary) => {
                // Card shadow
                pdf.setFillColor(0, 0, 0, 0.1);
                pdf.roundedRect(x + 2, y + 2, width, height, 6, 6, 'F');

                // Main card background
                pdf.setFillColor(255, 255, 255);
                pdf.setDrawColor(...colors.light);
                pdf.setLineWidth(1);
                pdf.roundedRect(x, y, width, height, 6, 6, 'FD');

                // Top accent stripe
                pdf.setFillColor(...color);
                pdf.roundedRect(x, y, width, 4, 6, 6, 'F');

                // Value with large, bold typography
                pdf.setTextColor(...colors.dark);
                pdf.setFontSize(24);
                pdf.setFont('helvetica', 'bold');
                const valueText = String(value);
                const valueWidth = pdf.getTextWidth(valueText);
                pdf.text(valueText, x + (width - valueWidth) / 2, y + 25);

                // Label with subtle styling
                pdf.setTextColor(...colors.medium);
                pdf.setFontSize(8);
                pdf.setFont('helvetica', 'normal');
                const labelLines = label.split('\n');
                labelLines.forEach((line, index) => {
                    const lineWidth = pdf.getTextWidth(line);
                    pdf.text(line, x + (width - lineWidth) / 2, y + 32 + (index * 4));
                });
            };

            // Progress bar component
            const addProgressBar = (x, y, width, percentage, color = colors.accent) => {
                // Background
                pdf.setFillColor(229, 231, 235);
                pdf.roundedRect(x, y, width, 6, 3, 3, 'F');

                // Progress fill
                const fillWidth = (width * percentage) / 100;
                if (fillWidth > 0) {
                    pdf.setFillColor(...color);
                    pdf.roundedRect(x, y, fillWidth, 6, 3, 3, 'F');
                }

                // Percentage text
                pdf.setTextColor(...colors.dark);
                pdf.setFontSize(8);
                pdf.setFont('helvetica', 'bold');
                pdf.text(`${percentage}%`, x + width + 5, y + 4);
            };

            // Chart simulation using rectangles
            const addSimpleChart = (x, y, width, height, data, title) => {
                // Chart background
                pdf.setFillColor(255, 255, 255);
                pdf.setDrawColor(...colors.light);
                pdf.roundedRect(x, y, width, height, 4, 4, 'FD');

                // Chart title
                pdf.setTextColor(...colors.dark);
                pdf.setFontSize(10);
                pdf.setFont('helvetica', 'bold');
                pdf.text(title, x + 5, y + 12);

                // Simple bar chart
                const chartArea = { x: x + 10, y: y + 20, width: width - 20, height: height - 30 };
                const maxValue = Math.max(...data.map(d => d.value));

                data.forEach((item, index) => {
                    const barWidth = chartArea.width / data.length - 5;
                    const barHeight = (item.value / maxValue) * chartArea.height;
                    const barX = chartArea.x + (index * (barWidth + 5));
                    const barY = chartArea.y + chartArea.height - barHeight;

                    // Bar
                    pdf.setFillColor(...colors.accent);
                    pdf.roundedRect(barX, barY, barWidth, barHeight, 2, 2, 'F');

                    // Label
                    pdf.setTextColor(...colors.medium);
                    pdf.setFontSize(7);
                    pdf.text(item.label, barX, chartArea.y + chartArea.height + 8);
                });
            };

            // Start creating the premium PDF
            addModernPageHeader(1, 2);

            // Hero section with user summary
            let yPosition = 50;

            // User info card
            pdf.setFillColor(255, 255, 255);
            pdf.setDrawColor(...colors.light);
            pdf.roundedRect(margin, yPosition, contentWidth, 25, 8, 8, 'FD');

            // Generated date with modern styling
            pdf.setTextColor(...colors.medium);
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            const dateText = `Report Generated: ${new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })}`;
            pdf.text(dateText, margin + 10, yPosition + 10);

            // Report type badge
            pdf.setFillColor(...colors.accent);
            pdf.roundedRect(margin + 10, yPosition + 15, 60, 8, 4, 4, 'F');
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'bold');
            pdf.text('COMPREHENSIVE ANALYTICS', margin + 15, yPosition + 20);

            yPosition += 35;

            // Extract and prepare data
            const stats = progressData?.stats || {};
            const progressStats = progressData?.progress || progressData || {};

            const displayStats = {
                totalFlashcardsCreated: stats.totalFlashcardsCreated || progressStats.totalFlashcardsCreated || 0,
                totalQuizzesTaken: stats.totalQuizzesTaken || progressStats.totalQuizzesTaken || 0,
                averageQuizScore: stats.averageQuizScore || progressStats.averageQuizScore || 0,
                currentStreak: stats.currentStreak || progressStats.currentStreak || 0,
                longestStreak: stats.longestStreak || progressStats.longestStreak || 0,
                topicsStudied: stats.topicsStudied || progressStats.topicsStudied || []
            };

            yPosition += 25;

            // Overview Statistics Section with premium design
            yPosition = addPremiumSectionHeader('Key Performance Metrics', 'STATS', yPosition);

            // Premium stats grid layout
            const cardWidth = (contentWidth - 20) / 3;
            const cardHeight = 40;
            const row1Y = yPosition;
            const row2Y = yPosition + 50;

            addPremiumStatCard('FLASHCARDS\nCREATED', displayStats.totalFlashcardsCreated, margin, row1Y, cardWidth, cardHeight, colors.primary);
            addPremiumStatCard('QUIZZES\nCOMPLETED', displayStats.totalQuizzesTaken, margin + cardWidth + 10, row1Y, cardWidth, cardHeight, colors.secondary);
            addPremiumStatCard('AVERAGE\nSCORE', `${Math.round(displayStats.averageQuizScore)}%`, margin + (cardWidth + 10) * 2, row1Y, cardWidth, cardHeight, colors.accent);

            addPremiumStatCard('CURRENT\nSTREAK', `${displayStats.currentStreak} days`, margin, row2Y, cardWidth, cardHeight, colors.warning);
            addPremiumStatCard('BEST\nSTREAK', `${displayStats.longestStreak} days`, margin + cardWidth + 10, row2Y, cardWidth, cardHeight, colors.success);
            addPremiumStatCard('TOTAL\nTOPICS', displayStats.topicsStudied.length, margin + (cardWidth + 10) * 2, row2Y, cardWidth, cardHeight, colors.danger);

            yPosition = row2Y + 55;

            // Performance Analytics Chart Section
            if (yPosition > pageHeight - 100) {
                pdf.addPage();
                addModernPageHeader(2, 3);
                yPosition = 50;
            }

            yPosition = addPremiumSectionHeader('Performance Analytics', 'CHART', yPosition, colors.secondary);

            // Create sample chart data for demonstration
            const chartData = [
                { label: 'Week 1', value: Math.max(1, Math.floor(displayStats.totalQuizzesTaken * 0.2)) },
                { label: 'Week 2', value: Math.max(1, Math.floor(displayStats.totalQuizzesTaken * 0.3)) },
                { label: 'Week 3', value: Math.max(1, Math.floor(displayStats.totalQuizzesTaken * 0.25)) },
                { label: 'Week 4', value: Math.max(1, Math.floor(displayStats.totalQuizzesTaken * 0.25)) }
            ];

            addSimpleChart(margin, yPosition, contentWidth, 50, chartData, 'Weekly Quiz Activity');
            yPosition += 65;

            // Study Progress Indicators
            yPosition = addPremiumSectionHeader('Study Progress Indicators', 'GOAL', yPosition, colors.accent);

            // Progress bars for different metrics
            const progressItems = [
                { label: 'Quiz Performance', percentage: Math.min(100, displayStats.averageQuizScore) },
                { label: 'Study Consistency', percentage: Math.min(100, (displayStats.currentStreak / 30) * 100) },
                { label: 'Content Coverage', percentage: Math.min(100, (displayStats.topicsStudied.length / 10) * 100) }
            ];

            progressItems.forEach((item, index) => {
                pdf.setTextColor(...colors.dark);
                pdf.setFontSize(10);
                pdf.setFont('helvetica', 'bold');
                pdf.text(item.label, margin, yPosition + 5);

                addProgressBar(margin + 50, yPosition + 2, contentWidth - 70, Math.round(item.percentage),
                    index === 0 ? colors.accent : index === 1 ? colors.success : colors.warning);

                yPosition += 15;
            });

            yPosition += 10;

            // Premium Topics Section
            if (Array.isArray(displayStats.topicsStudied) && displayStats.topicsStudied.length > 0) {
                if (yPosition > pageHeight - 80) {
                    pdf.addPage();
                    addModernPageHeader(3, 3);
                    yPosition = 50;
                }

                yPosition = addPremiumSectionHeader('Study Topics Overview', 'TOPIC', yPosition, colors.primary);

                // Topics grid layout
                const topicsToShow = displayStats.topicsStudied.slice(0, 8);
                const topicCardWidth = (contentWidth - 10) / 2;
                const topicCardHeight = 20;

                topicsToShow.forEach((topicData, index) => {
                    const x = margin + (index % 2) * (topicCardWidth + 10);
                    const y = yPosition + Math.floor(index / 2) * (topicCardHeight + 5);

                    if (y > pageHeight - 30) {
                        pdf.addPage();
                        addModernPageHeader(3, 3);
                        yPosition = 50;
                        return;
                    }

                    const topicName = typeof topicData === 'string' ? topicData :
                        (topicData?.topic || topicData?.name || `Topic ${index + 1}`);
                    const flashcardCount = topicData?.flashcardsCount || 0;
                    const quizCount = topicData?.quizzesCount || 0;

                    // Topic card background
                    pdf.setFillColor(255, 255, 255);
                    pdf.setDrawColor(...colors.light);
                    pdf.roundedRect(x, y, topicCardWidth, topicCardHeight, 4, 4, 'FD');

                    // Topic accent
                    pdf.setFillColor(...colors.secondary);
                    pdf.roundedRect(x, y, topicCardWidth, 3, 4, 4, 'F');

                    // Topic name
                    pdf.setTextColor(...colors.dark);
                    pdf.setFontSize(9);
                    pdf.setFont('helvetica', 'bold');
                    const truncatedName = topicName.length > 25 ? topicName.substring(0, 25) + '...' : topicName;
                    pdf.text(truncatedName, x + 5, y + 12);

                    // Topic stats
                    pdf.setTextColor(...colors.medium);
                    pdf.setFontSize(7);
                    pdf.setFont('helvetica', 'normal');
                    pdf.text(`${flashcardCount} cards • ${quizCount} quizzes`, x + 5, y + 17);
                });

                yPosition += Math.ceil(topicsToShow.length / 2) * 25 + 15;
            }

            // Achievement Badges Section
            if (yPosition > pageHeight - 60) {
                pdf.addPage();
                addModernPageHeader(3, 3);
                yPosition = 50;
            }

            yPosition = addPremiumSectionHeader('Achievements & Milestones', 'AWARD', yPosition, colors.warning);

            // Achievement badges
            const achievements = [];
            if (displayStats.totalFlashcardsCreated >= 50) achievements.push('Flashcard Master');
            if (displayStats.totalQuizzesTaken >= 10) achievements.push('Quiz Champion');
            if (displayStats.currentStreak >= 7) achievements.push('Consistent Learner');
            if (displayStats.averageQuizScore >= 80) achievements.push('High Achiever');
            if (displayStats.longestStreak >= 14) achievements.push('Dedication Expert');

            if (achievements.length === 0) achievements.push('Getting Started');

            achievements.forEach((achievement, index) => {
                const x = margin + (index % 3) * ((contentWidth - 20) / 3 + 10);
                const y = yPosition + Math.floor(index / 3) * 25;

                // Badge background
                pdf.setFillColor(...colors.warning);
                pdf.roundedRect(x, y, (contentWidth - 20) / 3, 18, 9, 9, 'F');

                // Badge text
                pdf.setTextColor(255, 255, 255);
                pdf.setFontSize(8);
                pdf.setFont('helvetica', 'bold');
                const textWidth = pdf.getTextWidth(achievement);
                pdf.text(achievement, x + ((contentWidth - 20) / 3 - textWidth) / 2, y + 11);
            });

            yPosition += Math.ceil(achievements.length / 3) * 25 + 15;

            // Premium Recent Activity Timeline
            if (analytics?.recentActivity && Array.isArray(analytics.recentActivity) && analytics.recentActivity.length > 0) {
                if (yPosition > pageHeight - 80) {
                    pdf.addPage();
                    addModernPageHeader(3, 3);
                    yPosition = 50;
                }

                yPosition = addPremiumSectionHeader('Recent Activity Timeline', 'TIME', yPosition, colors.accent);

                const recentActivities = analytics.recentActivity.slice(0, 6);

                recentActivities.forEach((activity, index) => {
                    const activityY = yPosition + (index * 12);

                    if (activityY > pageHeight - 40) return;

                    const date = activity.date ? new Date(activity.date).toLocaleDateString() : 'Recent';
                    const type = activity.activityType?.charAt(0).toUpperCase() + activity.activityType?.slice(1) || 'Study';
                    const topic = activity.activityData?.topic || 'General';

                    // Timeline dot
                    pdf.setFillColor(...colors.accent);
                    pdf.circle(margin + 5, activityY + 3, 2, 'F');

                    // Timeline line
                    if (index < recentActivities.length - 1) {
                        pdf.setDrawColor(...colors.light);
                        pdf.setLineWidth(1);
                        pdf.line(margin + 5, activityY + 5, margin + 5, activityY + 12);
                    }

                    // Activity content
                    pdf.setTextColor(...colors.dark);
                    pdf.setFontSize(9);
                    pdf.setFont('helvetica', 'bold');
                    pdf.text(`${type} Session`, margin + 12, activityY + 4);

                    pdf.setTextColor(...colors.medium);
                    pdf.setFontSize(8);
                    pdf.setFont('helvetica', 'normal');
                    pdf.text(topic, margin + 12, activityY + 8);
                    pdf.text(date, pageWidth - 50, activityY + 6);
                });

                yPosition += recentActivities.length * 12 + 10;
            }

            // Study Insights & Recommendations
            if (yPosition < pageHeight - 60) {
                yPosition = addPremiumSectionHeader('Study Insights & Recommendations', 'TIPS', yPosition, colors.success);

                const insights = [];
                if (displayStats.averageQuizScore >= 85) {
                    insights.push('Excellent quiz performance! Keep up the great work.');
                } else if (displayStats.averageQuizScore >= 70) {
                    insights.push('Good quiz scores. Consider reviewing challenging topics.');
                } else {
                    insights.push('Focus on understanding concepts before taking quizzes.');
                }

                if (displayStats.currentStreak >= 7) {
                    insights.push('Amazing consistency! Your daily study habit is paying off.');
                } else {
                    insights.push('Try to study a little each day to build momentum.');
                }

                insights.forEach((insight, index) => {
                    if (yPosition > pageHeight - 50) return;

                    pdf.setFillColor(255, 255, 255);
                    pdf.setDrawColor(...colors.success);
                    pdf.roundedRect(margin, yPosition, contentWidth, 12, 3, 3, 'FD');

                    pdf.setTextColor(...colors.dark);
                    pdf.setFontSize(9);
                    pdf.setFont('helvetica', 'normal');
                    pdf.text(`• ${insight}`, margin + 5, yPosition + 8);

                    yPosition += 15;
                });
            }

            // Add premium footer
            const addPremiumFooter = () => {
                const footerY = pageHeight - 25;

                pdf.setFillColor(...colors.light);
                pdf.rect(0, footerY, pageWidth, 25, 'F');

                pdf.setTextColor(...colors.medium);
                pdf.setFontSize(8);
                pdf.setFont('helvetica', 'normal');
                pdf.text('Generated by AI Study Assistant', margin, footerY + 10);

                pdf.setFont('helvetica', 'italic');
                pdf.text('Your personalized learning companion', margin, footerY + 15);

                pdf.setTextColor(...colors.primary);
                pdf.setFontSize(10);
                pdf.setFont('helvetica', 'bold');
                pdf.text('StudyAI', pageWidth - 35, footerY + 12);
            };

            addPremiumFooter();

            // Save with premium filename
            const fileName = `Premium_Study_Analytics_${new Date().toISOString().split('T')[0]}.pdf`;
            pdf.save(fileName);

            console.log('✅ Premium progress PDF export completed successfully');

        } catch (error) {
            console.error('Error exporting premium progress PDF:', error);
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
