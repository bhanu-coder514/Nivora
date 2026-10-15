// API Base Configuration
const API_BASE = window.location.origin + '/api';

// API Helper Functions
const api = {
  // GET request
  async get(endpoint, params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${API_BASE}${endpoint}${queryString ? '?' + queryString : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API GET Error:', error);
      throw error;
    }
  },

  // POST request
  async post(endpoint, body = {}) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API POST Error:', error);
      throw error;
    }
  },

  // POST with FormData (for file uploads)
  async postFormData(endpoint, formData) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        credentials: 'include',
        body: formData // Don't set Content-Type, browser will set it with boundary
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API POST FormData Error:', error);
      throw error;
    }
  },

  // PUT request
  async put(endpoint, body = {}) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API PUT Error:', error);
      throw error;
    }
  },

  // PUT with FormData
  async putFormData(endpoint, formData) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API PUT FormData Error:', error);
      throw error;
    }
  },

  // PATCH request
  async patch(endpoint, body = {}) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API PATCH Error:', error);
      throw error;
    }
  },

  // DELETE request
  async delete(endpoint) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API DELETE Error:', error);
      throw error;
    }
  }
};

// Toast Notifications
const toast = {
  show(message, type = 'info') {
    const toastContainer = this.getOrCreateContainer();

    const toastEl = document.createElement('div');
    toastEl.className = `toast-item toast-${type}`;
    toastEl.innerHTML = `
      <div class="toast-content">
        <i class="fas fa-${this.getIcon(type)} me-2"></i>
        <span>${message}</span>
      </div>
      <button class="toast-close" onclick="this.parentElement.remove()">
        <i class="fas fa-times"></i>
      </button>
    `;

    toastContainer.appendChild(toastEl);

    // Auto remove after 5 seconds
    setTimeout(() => {
      toastEl.style.animation = 'slideOut 0.3s ease forwards';
      setTimeout(() => toastEl.remove(), 300);
    }, 5000);
  },

  success(message) {
    this.show(message, 'success');
  },

  error(message) {
    this.show(message, 'error');
  },

  warning(message) {
    this.show(message, 'warning');
  },

  info(message) {
    this.show(message, 'info');
  },

  getIcon(type) {
    const icons = {
      success: 'check-circle',
      error: 'exclamation-circle',
      warning: 'exclamation-triangle',
      info: 'info-circle'
    };
    return icons[type] || 'info-circle';
  },

  getOrCreateContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 400px;
      `;
      document.body.appendChild(container);

      // Add toast styles if not already present
      if (!document.getElementById('toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
          .toast-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1rem 1.25rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease;
            background: white;
            border-left: 4px solid;
          }
          .toast-success { border-left-color: #10b981; background-color: #d1fae5; color: #065f46; }
          .toast-error { border-left-color: #ef4444; background-color: #fee2e2; color: #991b1b; }
          .toast-warning { border-left-color: #f59e0b; background-color: #fed7aa; color: #92400e; }
          .toast-info { border-left-color: #3b82f6; background-color: #dbeafe; color: #1e3a8a; }
          .toast-content {
            display: flex;
            align-items: center;
            flex: 1;
            font-weight: 500;
          }
          .toast-close {
            background: none;
            border: none;
            cursor: pointer;
            padding: 0;
            margin-left: 1rem;
            opacity: 0.7;
            transition: opacity 0.2s;
          }
          .toast-close:hover { opacity: 1; }
          @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(400px); opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }
    }
    return container;
  }
};

// Loading Overlay
const loading = {
  show(message = 'Loading...') {
    let overlay = document.getElementById('loading-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'loading-overlay';
      overlay.className = 'loading-overlay';
      overlay.innerHTML = `
        <div class="text-center">
          <div class="spinner mx-auto mb-3"></div>
          <p class="loading-message" style="color: #374151; font-weight: 500;">${message}</p>
        </div>
      `;
      document.body.appendChild(overlay);
    } else {
      overlay.querySelector('.loading-message').textContent = message;
      overlay.style.display = 'flex';
    }
  },

  hide() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
  }
};

// Format Currency
function formatCurrency(amount) {
  if (amount === null || amount === undefined) return 'Not specified';
  return '₹' + new Intl.NumberFormat('en-IN').format(amount);
}

// Format Date
function formatDate(dateString) {
  if (!dateString) return 'Not specified';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Format Room Type
function formatRoomType(type) {
  const map = {
    'single': 'Single Room',
    'double-sharing': 'Double Sharing',
    'triple-sharing': 'Triple Sharing',
    'studio': 'Studio',
    '1bhk': '1 BHK',
    '2bhk': '2 BHK',
    '3bhk': '3 BHK'
  };
  return map[type] || type;
}

// Format Property Type
function formatPropertyType(type) {
  const map = {
    'pg': 'PG',
    'hostel': 'Hostel',
    'flat': 'Flat',
    'independent-room': 'Independent Room',
    'shared-apartment': 'Shared Apartment',
    'studio': 'Studio'
  };
  return map[type] || type;
}

// Format Furnishing Status
function formatFurnishing(status) {
  const map = {
    'furnished': 'Furnished',
    'semi-furnished': 'Semi-Furnished',
    'unfurnished': 'Unfurnished'
  };
  return map[status] || status;
}

// Format Amenity
function formatAmenity(amenity) {
  const map = {
    'bed': 'Bed',
    'mattress': 'Mattress',
    'wardrobe': 'Wardrobe',
    'study-table': 'Study Table',
    'chair': 'Chair',
    'fan': 'Fan',
    'ac': 'AC',
    'cooler': 'Cooler',
    'attached-bathroom': 'Attached Bathroom',
    'shared-bathroom': 'Shared Bathroom',
    'kitchen': 'Kitchen',
    'refrigerator': 'Refrigerator',
    'washing-machine': 'Washing Machine',
    'wifi': 'Wi-Fi',
    'parking': 'Parking',
    'water-supply': 'Water Supply',
    'power-backup': 'Power Backup',
    'cctv': 'CCTV',
    'security': 'Security',
    'balcony': 'Balcony',
    'lift': 'Lift',
    'furnished-kitchen': 'Furnished Kitchen'
  };
  return map[amenity] || amenity;
}

// Get Amenity Icon
function getAmenityIcon(amenity) {
  const icons = {
    'bed': 'bed',
    'mattress': 'bed',
    'wardrobe': 'door-closed',
    'study-table': 'desk',
    'chair': 'chair',
    'fan': 'fan',
    'ac': 'snowflake',
    'cooler': 'wind',
    'attached-bathroom': 'bath',
    'shared-bathroom': 'bath',
    'kitchen': 'utensils',
    'refrigerator': 'temperature-low',
    'washing-machine': 'tint',
    'wifi': 'wifi',
    'parking': 'parking',
    'water-supply': 'tint',
    'power-backup': 'bolt',
    'cctv': 'video',
    'security': 'shield-alt',
    'balcony': 'home',
    'lift': 'arrow-up',
    'furnished-kitchen': 'utensils'
  };
  return icons[amenity] || 'check';
}

// Escape HTML
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Get Query Parameters
function getQueryParams() {
  const params = {};
  const queryString = window.location.search.substring(1);
  const pairs = queryString.split('&');

  for (const pair of pairs) {
    if (pair) {
      const [key, value] = pair.split('=');
      params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    }
  }

  return params;
}

// Update URL with params (without reload)
function updateURLParams(params) {
  const url = new URL(window.location);
  Object.keys(params).forEach(key => {
    if (params[key]) {
      url.searchParams.set(key, params[key]);
    } else {
      url.searchParams.delete(key);
    }
  });
  window.history.pushState({}, '', url);
}

// Confirm Dialog
function confirmDialog(message) {
  return new Promise((resolve) => {
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.style.display = 'flex';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Confirm Action</h5>
        </div>
        <div class="modal-body">
          <p>${message}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-action="cancel">Cancel</button>
          <button class="btn btn-primary" data-action="confirm">Confirm</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
      if (e.target.dataset.action === 'confirm') {
        resolve(true);
        modal.remove();
      } else if (e.target.dataset.action === 'cancel' || e.target === modal) {
        resolve(false);
        modal.remove();
      }
    });
  });
}

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
