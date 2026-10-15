// Authentication Helper Functions

// Check if user is logged in
async function checkAuth() {
  try {
    const data = await api.get('/auth/me');
    return data.success ? data.user : null;
  } catch (error) {
    return null;
  }
}

// Get current user
async function getCurrentUser() {
  return await checkAuth();
}

// Update auth UI based on login status
async function updateAuthUI() {
  const user = await checkAuth();

  const authLinks = document.getElementById('authLinks');
  const getUserStarted = document.getElementById('getUserStarted');

  if (!authLinks) return;

  if (user) {
    // User is logged in
    authLinks.innerHTML = `
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown">
          <i class="fas fa-user-circle me-1"></i> ${escapeHtml(user.name)}
        </a>
        <ul class="dropdown-menu dropdown-menu-end">
          <li><a class="dropdown-item" href="/${user.role}-dashboard.html">
            <i class="fas fa-tachometer-alt me-2"></i>Dashboard
          </a></li>
          ${user.role === 'student' ? `
            <li><a class="dropdown-item" href="/wishlist.html">
              <i class="fas fa-heart me-2"></i>My Wishlist
            </a></li>
            <li><a class="dropdown-item" href="/inquiries.html">
              <i class="fas fa-envelope me-2"></i>My Inquiries
            </a></li>
            <li><a class="dropdown-item" href="/requirements.html">
              <i class="fas fa-list me-2"></i>My Requirements
            </a></li>
          ` : ''}
          ${user.role === 'owner' ? `
            <li><a class="dropdown-item" href="/add-property.html">
              <i class="fas fa-plus me-2"></i>Add Property
            </a></li>
          ` : ''}
          ${user.role === 'admin' ? `
            <li><a class="dropdown-item" href="/admin-dashboard.html">
              <i class="fas fa-shield-alt me-2"></i>Admin Panel
            </a></li>
          ` : ''}
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item" href="/profile.html">
            <i class="fas fa-user me-2"></i>Profile
          </a></li>
          <li><a class="dropdown-item" href="#" id="logoutBtn">
            <i class="fas fa-sign-out-alt me-2"></i>Logout
          </a></li>
        </ul>
      </li>
    `;

    if (getUserStarted) {
      getUserStarted.style.display = 'none';
    }

    // Add logout handler
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', handleLogout);
    }
  } else {
    // User is not logged in
    authLinks.innerHTML = `<a class="nav-link" href="/login.html">Login</a>`;
    if (getUserStarted) {
      getUserStarted.style.display = 'block';
    }
  }
}

// Handle logout
async function handleLogout(e) {
  e.preventDefault();

  try {
    loading.show('Logging out...');
    await api.post('/auth/logout');
    toast.success('Logged out successfully!');

    setTimeout(() => {
      window.location.href = '/';
    }, 500);
  } catch (error) {
    loading.hide();
    toast.error('Logout failed: ' + error.message);
  }
}

// Protect page (redirect if not logged in)
async function requireAuth(allowedRoles = []) {
  const user = await checkAuth();

  if (!user) {
    toast.warning('Please log in to access this page.');
    setTimeout(() => {
      window.location.href = '/login.html?redirect=' + encodeURIComponent(window.location.pathname);
    }, 1000);
    return null;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    toast.error('You do not have permission to access this page.');
    setTimeout(() => {
      window.location.href = `/${user.role}-dashboard.html`;
    }, 1000);
    return null;
  }

  return user;
}

// Redirect if already logged in
async function redirectIfAuthenticated() {
  const user = await checkAuth();

  if (user) {
    const redirect = new URLSearchParams(window.location.search).get('redirect');
    if (redirect) {
      window.location.href = redirect;
    } else {
      window.location.href = `/${user.role}-dashboard.html`;
    }
    return true;
  }

  return false;
}

// Handle registration
async function handleRegister(formData, role = 'student') {
  try {
    loading.show('Creating your account...');

    const data = await api.post('/auth/register', {
      ...formData,
      role
    });

    loading.hide();
    toast.success(data.message || 'Registration successful!');

    // Redirect after short delay
    setTimeout(() => {
      const redirect = new URLSearchParams(window.location.search).get('redirect');
      window.location.href = redirect || `/${role}-dashboard.html`;
    }, 1000);

    return data;
  } catch (error) {
    loading.hide();
    throw error;
  }
}

// Handle login
async function handleLogin(email, password) {
  try {
    loading.show('Logging in...');

    const data = await api.post('/auth/login', { email, password });

    loading.hide();
    toast.success(data.message || 'Login successful!');

    // Redirect after short delay
    setTimeout(() => {
      const redirect = new URLSearchParams(window.location.search).get('redirect');
      window.location.href = redirect || `/${data.user.role}-dashboard.html`;
    }, 1000);

    return data;
  } catch (error) {
    loading.hide();
    throw error;
  }
}

// Form validation helper
function validateForm(formElement) {
  const inputs = formElement.querySelectorAll('input[required], select[required], textarea[required]');
  let isValid = true;

  inputs.forEach(input => {
    const value = input.value.trim();
    const errorElement = input.nextElementSibling;

    // Remove previous error state
    input.classList.remove('is-invalid');
    if (errorElement && errorElement.classList.contains('invalid-feedback')) {
      errorElement.style.display = 'none';
    }

    // Check if empty
    if (!value) {
      isValid = false;
      input.classList.add('is-invalid');
      if (errorElement && errorElement.classList.contains('invalid-feedback')) {
        errorElement.textContent = 'This field is required.';
        errorElement.style.display = 'block';
      }
      return;
    }

    // Email validation
    if (input.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        input.classList.add('is-invalid');
        if (errorElement && errorElement.classList.contains('invalid-feedback')) {
          errorElement.textContent = 'Please enter a valid email address.';
          errorElement.style.display = 'block';
        }
      }
    }

    // Phone validation (Indian 10-digit)
    if (input.name === 'phone') {
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(value)) {
        isValid = false;
        input.classList.add('is-invalid');
        if (errorElement && errorElement.classList.contains('invalid-feedback')) {
          errorElement.textContent = 'Please enter a valid 10-digit phone number.';
          errorElement.style.display = 'block';
        }
      }
    }

    // Password length
    if (input.type === 'password' && input.name === 'password') {
      if (value.length < 6) {
        isValid = false;
        input.classList.add('is-invalid');
        if (errorElement && errorElement.classList.contains('invalid-feedback')) {
          errorElement.textContent = 'Password must be at least 6 characters.';
          errorElement.style.display = 'block';
        }
      }
    }

    // Confirm password
    if (input.name === 'confirmPassword') {
      const passwordInput = formElement.querySelector('input[name="password"]');
      if (passwordInput && value !== passwordInput.value) {
        isValid = false;
        input.classList.add('is-invalid');
        if (errorElement && errorElement.classList.contains('invalid-feedback')) {
          errorElement.textContent = 'Passwords do not match.';
          errorElement.style.display = 'block';
        }
      }
    }
  });

  return isValid;
}

// Display API errors on form
function displayFormErrors(formElement, errors) {
  if (Array.isArray(errors)) {
    errors.forEach(error => {
      const input = formElement.querySelector(`[name="${error.param}"]`);
      if (input) {
        input.classList.add('is-invalid');
        const errorElement = input.nextElementSibling;
        if (errorElement && errorElement.classList.contains('invalid-feedback')) {
          errorElement.textContent = error.msg;
          errorElement.style.display = 'block';
        }
      }
    });
  }
}
