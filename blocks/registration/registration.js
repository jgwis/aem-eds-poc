export default function decorate(block) {
  const endpoint = block.dataset.endpoint || 'http://localhost:3001/registration';
  const form = document.createElement('form');
  form.className = 'registration-form';
  form.noValidate = true;
  form.innerHTML = `
    <div class="registration-form-fields">
      <label>First name<input name="firstName" autocomplete="given-name" required maxlength="200"></label>
      <label>Last name<input name="lastName" autocomplete="family-name" required maxlength="200"></label>
      <label>Email<input name="email" type="email" autocomplete="email" required maxlength="200"></label>
      <label>Country<input name="country" autocomplete="country" maxlength="200"></label>
      <fieldset>
        <legend>Communication preferences</legend>
        <label><input name="emailPreference" type="checkbox"> Email</label>
        <label><input name="phonePreference" type="checkbox"> Phone</label>
      </fieldset>
      <label class="registration-consent"><input name="consent" type="checkbox" required> I agree to the privacy notice and communications policy.</label>
    </div>
    <button type="submit">Submit registration</button>
    <p class="registration-status" role="status" aria-live="polite"></p>
  `;

  block.replaceChildren(form);
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const status = form.querySelector('.registration-status');
    const formData = new FormData(form);
    const payload = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      country: formData.get('country') || undefined,
      consent: formData.get('consent') === 'on',
      communicationPreferences: {
        email: formData.get('emailPreference') === 'on',
        phone: formData.get('phonePreference') === 'on',
      },
    };

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    status.textContent = 'Submitting...';
    status.className = 'registration-status';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Registration failed');
      form.reset();
      status.textContent = 'Registration accepted.';
      status.classList.add('success');
    } catch (error) {
      status.textContent = error.message || 'Registration failed. Please try again.';
      status.classList.add('error');
    } finally {
      submitButton.disabled = false;
    }
  });
}
