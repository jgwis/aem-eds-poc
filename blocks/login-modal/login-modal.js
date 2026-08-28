export default function decorate(block) {
  block.innerHTML = `
    <button class="login-modal-button" type="button">
      Login
    </button>

    <div class="login-modal-overlay" hidden>
      <div class="login-modal" role="dialog" aria-modal="true">
        
        <button class="login-modal-close" type="button" aria-label="Close">
          &times;
        </button>

        <h2>Login</h2>

        <form class="login-form">
          <label>
            Email
            <input
              type="email"
              name="email"
              required
              placeholder="Enter email"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              required
              placeholder="Enter password"
            />
          </label>

          <button type="submit">
            Login
          </button>
        </form>

      </div>
    </div>
  `;

  const openButton = block.querySelector('.login-modal-button');
  const closeButton = block.querySelector('.login-modal-close');
  const overlay = block.querySelector('.login-modal-overlay');
  const form = block.querySelector('.login-form');

  // Open modal
  openButton.addEventListener('click', () => {
    overlay.hidden = false;
    document.body.classList.add('modal-open');

    overlay.querySelector('input').focus();
  });

  function closeModal() {
    overlay.hidden = true;
    document.body.classList.remove('modal-open');
  }

  // Close modal
  closeButton.addEventListener('click', () => {
    closeModal();
  });

  // Close when clicking outside modal
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      closeModal();
    }
  });

  // Close with Escape key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !overlay.hidden) {
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

        closeModal();

        // Example redirect
        window.location.href = '/dashboard';
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (error) {
      console.error(error);
      alert('Unable to connect to login service');
    }
  });
}
