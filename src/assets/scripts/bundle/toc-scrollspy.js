// Highlights the table-of-contents entry for the section currently in view.
// Progressive enhancement: without JS the TOC is still a working list of links.
const toc = document.querySelector('.post-toc');

if (toc && 'IntersectionObserver' in window) {
  const links = [...toc.querySelectorAll('a[href^="#"]')];

  // Map each heading element to its TOC link, keeping document order.
  const linkByHeading = new Map();
  const headings = [];
  for (const link of links) {
    const id = decodeURIComponent(link.hash.slice(1));
    const heading = id && document.getElementById(id);
    if (heading) {
      linkByHeading.set(heading, link);
      headings.push(heading);
    }
  }

  if (headings.length) {
    let activeLink = null;

    const setActive = link => {
      if (link === activeLink) return;
      if (activeLink) {
        activeLink.classList.remove('is-active');
        activeLink.removeAttribute('aria-current');
      }
      activeLink = link;
      if (link) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'true');
      }
    };

    // Headings currently inside the "reading band" near the top of the viewport.
    const visible = new Set();

    // After a click the page jumps to a heading that sits above the reading
    // band, so briefly suppress the observer to keep the clicked link lit.
    let suppressUntil = 0;

    const observer = new IntersectionObserver(
      entries => {
        if (performance.now() < suppressUntil) return;

        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.add(entry.target);
          } else {
            visible.delete(entry.target);
          }
        }

        // Keep the previous highlight when nothing is in the band (e.g. a long
        // stretch of prose between two headings).
        if (!visible.size) return;

        const topmost = [...visible].sort(
          (a, b) => headings.indexOf(a) - headings.indexOf(b)
        )[0];
        setActive(linkByHeading.get(topmost));
      },
      {rootMargin: '-80px 0px -70% 0px', threshold: 0}
    );

    headings.forEach(heading => observer.observe(heading));

    // Light up the clicked entry straight away, since the post-click scroll
    // position lands outside the observer's reading band.
    for (const link of links) {
      link.addEventListener('click', () => {
        setActive(link);
        suppressUntil = performance.now() + 700;
      });
    }

    // Sensible starting state before the first scroll.
    setActive(linkByHeading.get(headings[0]));
  }
}
