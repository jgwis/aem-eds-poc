/**
 * Register Modal Block
 *
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const content = block.querySelector(':scope > div');

  if (!content) return;

  // Create modal structure
  const modal = document.createElement('div');
  modal.className = 'register-modal-overlay';
  modal.hidden = true;

  modal.innerHTML = `
    <div
      class="register-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="register-modal-title">

      <button
        type="button"
        class="register-modal-close"
        aria-label="Close registration">
        &times;
      </button>

      <div class="register-modal-content">
        <h2 id="register-modal-title">Create Account</h2>
        <form class="register-form">
          <div class="form-group">
            <label for="register-name">
              Full Name
            </label>
            <input
              id="register-name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              autocomplete="name"
              required>
          </div>

          <div class="form-group">
            <label for="register-email">
              Email
            </label>
            <input
              id="register-email"
              name="email"
              type="email"
              placeholder="Enter your email"
              autocomplete="email"
              required>
          </div>

          <div class="form-group">
            <label for="register-phone">
              Mobile Number
            </label>
            <input
              id="register-phone"
              name="phone"
              type="tel"
              placeholder="Enter your mobile number"
              autocomplete="tel"
              required>
          </div>

          <div class="form-group">
            <label for="register-password">
              Password
            </label>
            <input
              id="register-password"
              name="password"
              type="password"
              placeholder="Create a password"
              autocomplete="new-password"
              required>
          </div>

          <div class="form-group">
            <label for="register-confirm-password">
              Confirm Password
            </label>
            <input
              id="register-confirm-password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              autocomplete="new-password"
              required>
          </div>

          <button
            type="submit"
            class="register-submit">
            Sign Up
          </button>

        </form>

        <p class="register-login-text">
          Already have an account?
          <button
            type="button"
            class="register-login-button">
            Sign In
          </button>
        </p>
      </div>
    </div>
  `;

  block.innerHTML = '';
  block.append(modal);

  const closeButton = modal.querySelector('.register-modal-close');

  const form = modal.querySelector('.register-form');

  const loginButton = modal.querySelector('.register-login-button');

  function openModal() {
    modal.hidden = false;
    document.body.classList.add('register-modal-open');

    const firstInput = modal.querySelector('input');

    if (firstInput) {
      firstInput.focus();
    }
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove('register-modal-open');
  }

  closeButton.addEventListener('click', closeModal);

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) {
      closeModal();
    }
  });

  /**
   * Register form
   */
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const password = form.querySelector('[name="password"]').value;

    const confirmPassword = form.querySelector(
      '[name="confirmPassword"]',
    ).value;

    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    const formData = new FormData(form);

    const data = Object.fromEntries(formData.entries());

    console.log('Registration data:', data);

    // Call your registration API here.

    closeModal();
  });

  loginButton.addEventListener('click', () => {
    closeModal();

    const loginModal = document.querySelector('.login-modal-overlay');

    if (loginModal) {
      loginModal.hidden = false;

      document.body.classList.add('login-modal-open');
    }
  });

  // Expose open function to the block
  block.openRegisterModal = openModal;
}
