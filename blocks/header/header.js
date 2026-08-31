import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector(
      '[aria-expanded="true"]',
    );
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector(
      '[aria-expanded="true"]',
    );
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections
    .querySelectorAll('.nav-sections .default-content-wrapper > ul > li')
    .forEach((section) => {
      section.setAttribute('aria-expanded', expanded);
    });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null
    ? !forceExpanded
    : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = expanded || isDesktop.matches ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(
    navSections,
    expanded || isDesktop.matches ? 'false' : 'true',
  );
  button.setAttribute(
    'aria-label',
    expanded ? 'Open navigation' : 'Close navigation',
  );
  // enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
    // collapse menu on focus lost
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  const loginFragment = await loadFragment('/login-modal');

  const registerFragment = await loadFragment('/register-modal');
  if (loginFragment) {
    document.body.append(loginFragment);
  }
  if (registerFragment) {
    document.body.append(registerFragment);
  }
  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand.querySelector('.button');
  if (brandLink) {
    brandLink.className = '';
    brandLink.closest('.button-container').className = '';
  }

  // Find the text block
  const textBlock = nav.querySelector('.text.block');

  if (textBlock) {
    textBlock.querySelectorAll(':scope > div').forEach((row) => {
      const cells = row.children;
      if (!cells.length) return;

      const label = cells[0]?.textContent.trim();
      const href = cells[1]?.textContent.trim();

      // Link row
      row.innerHTML = `
        
          <a href="${href}">${label}</a>
        
      `;
    });
  }

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections
      .querySelectorAll(':scope .default-content-wrapper > ul > li')
      .forEach((navSection) => {
        if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
        navSection.addEventListener('click', () => {
          if (isDesktop.matches) {
            const expanded = navSection.getAttribute('aria-expanded') === 'true';
            toggleAllNavSections(navSections);
            navSection.setAttribute(
              'aria-expanded',
              expanded ? 'false' : 'true',
            );
          }
        });
      });
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);

  const navTools = nav.querySelector('.nav-tools');
  const signInBtn = document.createElement('button');
  const registerBtn = document.createElement('button');
  const user = JSON.parse(localStorage.getItem('user'));
  let userIcon = await fetch('/icons/user.svg');
  let arrowIcon = await fetch('/icons/down-arrow.svg');
  userIcon = await userIcon.text();
  arrowIcon = await arrowIcon.text();

  // if (!user) return;

  if (navTools) {
    signInBtn.className = 'signin-btn';
    signInBtn.textContent = 'Sign In';
    if (user) {
      signInBtn.style.display = 'none';
      registerBtn.style.display = 'none';
      // Create user section
      const userBox = document.createElement('div');
      userBox.className = 'nav-user';

      userBox.innerHTML = `
  <button class="nav-user-button" type="button" aria-expanded="false">
    <span class="user-icon">${userIcon}</span>
    <span class="user-name">${user.name}</span>
    <span class="dropdown-arrow">${arrowIcon}</span>
  </button>

  <div class="user-dropdown">
    <a href="/dashboard">Dashboard</a>
    <a href="/profile">Profile</a>
    <button class="logout-btn" type="button">Logout</button>
  </div>
  `;

      nav.appendChild(userBox);
      const userButton = userBox.querySelector('.nav-user-button');
      // const userDropdown = userBox.querySelector('.user-dropdown');
      const logoutBtn = userBox.querySelector('.logout-btn');

      userButton.addEventListener('click', () => {
        const isOpen = userBox.classList.toggle('open');

        userButton.setAttribute(
          'aria-expanded',
          isOpen.toString(),
        );
      });

      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');

        window.location.href = '/';
      });
    }
    signInBtn.addEventListener('click', () => {
      const modal = document.querySelector('.login-modal-overlay');
      if (modal) {
        modal.hidden = false;
        document.body.classList.add('login-modal-open');

        modal.querySelector('input')?.focus();
      }
    });
    navTools.append(signInBtn);
    registerBtn.textContent = 'Sign Up';
    registerBtn.className = 'register-btn';

    registerBtn.addEventListener('click', () => {
      const modal = document.querySelector('.register-modal-overlay');

      if (modal) {
        modal.hidden = false;
        document.body.classList.add('register-modal-open');

        modal.querySelector('input')?.focus();
      }
    });

    navTools.append(registerBtn);
  }
}
