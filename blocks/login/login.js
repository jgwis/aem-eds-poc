export default function decorate(block) {
  const endpoint = block.dataset.endpoint || 'http://localhost:3001/login';
  block.innerHTML = `
    <form class="login-form">
      <h2>Login</h2>

      <label>Email</label>
      <input
        type="email"
        name="email"
        placeholder="Enter your email"
        required
      >

      <label>Password</label>
      <input
        type="password"
        name="password"
        placeholder="Enter password"
        required
      >

      <label class="remember">
        <input type="checkbox" name="rememberMe">
        Remember Me
      </label>

      <button type="submit">Login</button>

      <p class="message"></p>
    </form>
  `;

  const form = block.querySelector('.login-form');
  const message = block.querySelector('.message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    const payload = {
      email: formData.get('email'),
      password: formData.get('password'),
      rememberMe: formData.get('rememberMe') === 'on',
    };

    message.textContent = 'Logging in...';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        message.textContent = 'Login Successful';

        localStorage.setItem('accessToken', data.accessToken);

        // Redirect
        window.location.href = '/dashboard';
      } else {
        message.textContent = data.error || 'Login Failed';
      }
    } catch (err) {
      message.textContent = 'Server Error';
    }
  });
}
