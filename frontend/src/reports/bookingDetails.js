import api from '../api';

export const getBookingDetails = async (fromDt, toDt, orgId) => {
    try {
        const response = await api.get(`api/booking/org/reports/${fromDt}/${toDt}/${orgId}/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching booking details:', error);
        throw error; // Re-throw to handle in the component
    }
};