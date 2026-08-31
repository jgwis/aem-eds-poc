/**
 * Login Modal Block
 *
 * @param {Element} block The block element
 */
export default function decorate(block) {
  // Create modal overlay
  const modal = document.createElement('div');
  modal.className = 'login-modal-overlay';
  modal.hidden = true;

  // Create modal content INSIDE modal
  modal.innerHTML = `
    <div
      class="login-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title">

      <button
        class="login-modal-close"
        type="button"
        aria-label="Close">
        &times;
      </button>

      <div class="login-modal-content">

        <h3 id="login-modal-title">
          Sign In
        </h3>

        <form class="login-form">

          <div class="form-group">
            <label for="modal-email">
              Email
            </label>

            <input
              id="modal-email"
              type="email"
              name="email"
              required
              autocomplete="email"
              placeholder="Enter email">
          </div>

          <div class="form-group">
            <label for="modal-password">
              Password
            </label>

            <input
              id="modal-password"
              type="password"
              name="password"
              required
              autocomplete="current-password"
              placeholder="Enter password">
          </div>

          <button type="submit">
            Login
          </button>

        </form>

        <p class="login-register-text">
          Don't have an account?

          <button
            type="button"
            class="login-register-button">
            Register
          </button>
        </p>

      </div>
    </div>
  `;

  // Replace block content with modal
  block.innerHTML = '';
  block.append(modal);

  // Elements
  const closeButton = modal.querySelector('.login-modal-close');

  const form = modal.querySelector('.login-form');

  const registerButton = modal.querySelector('.login-register-button');

  function openModal() {
    modal.hidden = false;
    document.body.classList.add('login-modal-open');
    const firstInput = modal.querySelector('input');

    if (firstInput) {
      firstInput.focus();
    }
  }

  function closeModal() {
    modal.hidden = true;

    document.body.classList.remove('login-modal-open');
  }
  closeButton.addEventListener('click', closeModal);

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  // Close with Escape
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) {
      closeModal();
    }
  });

  // Login submit
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const payload = {
      email: formData.get('email'),
      password: formData.get('password'),
    };

    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful', data);
        // Save user details
        localStorage.setItem('user', JSON.stringify({
          name: 'Jitendra',
          email: 'jitendra.mail123@gmail.com',
        }));
        closeModal();
        window.location.href = '/products';
      } else {
        // eslint-disable-next-line no-alert
        alert(data.error || 'Login failed');
      }
    } catch (error) {
      console.error(error);

      // eslint-disable-next-line no-alert
      alert('Unable to connect to login service');
    }
  });

  registerButton.addEventListener('click', () => {
    closeModal();

    const registerModal = document.querySelector('.register-modal-overlay');

    if (registerModal) {
      registerModal.hidden = false;

      document.body.classList.add('register-modal-open');
    }
  });

  // Expose open function
  block.openLoginModal = openModal;
}
