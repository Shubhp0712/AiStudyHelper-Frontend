const API_BASE_URL = 'http://localhost:5000/api';

export const otpService = {
    // Send OTP to email
    sendOTP: async (email) => {
        try {
            const response = await fetch(`${API_BASE_URL}/otp/send-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send OTP');
            }

            return data;
        } catch (error) {
            console.error('Error sending OTP:', error);
            throw error;
        }
    },

    // Verify OTP
    verifyOTP: async (email, otp) => {
        try {
            const response = await fetch(`${API_BASE_URL}/otp/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to verify OTP');
            }

            return data;
        } catch (error) {
            console.error('Error verifying OTP:', error);
            throw error;
        }
    },

    // Resend OTP
    resendOTP: async (email) => {
        try {
            const response = await fetch(`${API_BASE_URL}/otp/resend-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to resend OTP');
            }

            return data;
        } catch (error) {
            console.error('Error resending OTP:', error);
            throw error;
        }
    }
};
