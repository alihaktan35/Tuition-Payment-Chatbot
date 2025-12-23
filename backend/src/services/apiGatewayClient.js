import axios from 'axios';
import { config } from '../config/config.js';

const api = axios.create({
  baseURL: config.apiGatewayUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Get JWT token for authenticated requests
 * @returns {Promise<string>} JWT token
 */
async function getAuthToken() {
  try {
    const response = await api.post('/api/v1/auth/login', {
      username: config.adminUsername,
      password: config.adminPassword,
    });
    return response.data.token;
  } catch (error) {
    console.error('[API Gateway] Authentication error:', error.response?.data || error.message);
    throw new Error('Failed to authenticate with API Gateway');
  }
}

/**
 * Query tuition for a student (mobile endpoint - no auth, rate limited)
 * @param {string} studentNo - Student number
 * @returns {Promise<object>} Tuition information
 */
export async function queryTuition(studentNo) {
  try {
    console.log(`[API Gateway] Querying tuition for student: ${studentNo}`);
    const response = await api.get(`/api/v1/tuition/query/${studentNo}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('[API Gateway] Query tuition error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
      statusCode: error.response?.status,
    };
  }
}

/**
 * Query tuition via banking endpoint (requires auth)
 * @param {string} studentNo - Student number
 * @returns {Promise<object>} Tuition information
 */
export async function queryTuitionBanking(studentNo) {
  try {
    const token = await getAuthToken();
    console.log(`[API Gateway] Querying tuition (banking) for student: ${studentNo}`);
    const response = await api.get(`/api/v1/banking/tuition/${studentNo}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('[API Gateway] Query tuition (banking) error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
      statusCode: error.response?.status,
    };
  }
}

/**
 * Pay tuition (no auth required, supports partial payments)
 * @param {string} studentNo - Student number
 * @param {string} term - Term (e.g., "2024-Fall")
 * @param {number} amount - Payment amount in TRY
 * @returns {Promise<object>} Payment result
 */
export async function payTuition(studentNo, term, amount) {
  try {
    console.log(`[API Gateway] Processing payment: ${studentNo}, ${term}, ${amount} TRY`);
    const response = await api.post('/api/v1/banking/pay', {
      studentNo,
      term,
      amount: parseFloat(amount),
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('[API Gateway] Pay tuition error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
      statusCode: error.response?.status,
    };
  }
}

/**
 * Get unpaid tuition list (admin only, paginated)
 * @param {string} term - Term (e.g., "2024-Fall")
 * @param {number} page - Page number (default: 1)
 * @param {number} pageSize - Page size (default: 20)
 * @returns {Promise<object>} List of unpaid students
 */
export async function getUnpaidTuition(term, page = 1, pageSize = 20) {
  try {
    const token = await getAuthToken();
    console.log(`[API Gateway] Getting unpaid tuition for term: ${term}, page: ${page}`);
    const response = await api.get(`/api/v1/admin/unpaid/${term}`, {
      params: { page, pageSize },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('[API Gateway] Unpaid tuition error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
      statusCode: error.response?.status,
    };
  }
}
