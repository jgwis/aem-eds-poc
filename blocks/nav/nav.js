export default function decorate(block) {
  const nav = document.createElement('nav');
  nav.className = 'nav';

  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const cells = [...row.children];

    if (cells.length < 2) return;

    const text = cells[0].textContent.trim();
    const url = cells[1].textContent.trim();

    const li = document.createElement('li');
    const a = document.createElement('a');

    a.href = url;
    a.textContent = text;

    li.append(a);
    ul.append(li);
  });

  nav.append(ul);

  block.replaceChildren(nav);
}
