import { certificates, experience, portfolio, projects, skills, technologies } from './data.js';

const IMAGE_PATH = '/assets/images/';

// Escape text before adding portfolio content to a small HTML template.
function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[character]));
}

// Fill the two repeated technology rows so the strip can scroll without a gap.
function renderMarqueeRow(elementId, items) {
  const row = document.getElementById(elementId);
  const words = [...items, ...items];
  row.innerHTML = words.map((word, index) => {
    const highlighted = index % 3 === 2 ? ' marquee-highlight' : '';
    return `<span class="marquee-word${highlighted}" aria-hidden="true">${escapeHtml(word)}</span>`;
  }).join('');
}

// Fill editable personal details into the sections that use them.
function renderProfile() {
  document.getElementById('about-copy').textContent = portfolio.about;
  document.getElementById('about-detail').textContent = portfolio.aboutDetail;
  document.getElementById('currently-text').textContent = portfolio.current;
  document.getElementById('contact-email-link').href = `mailto:${portfolio.email}`;
  document.getElementById('contact-email-link').innerHTML = `${escapeHtml(portfolio.email)} <span aria-hidden="true">↗</span>`;
  document.getElementById('phone-link').href = `tel:${portfolio.phone.replace(/\s/g, '')}`;
  document.getElementById('phone-link').textContent = portfolio.phone;
  document.getElementById('copyright-year').textContent = new Date().getFullYear();
}

// Build one card for each skill group and animate its original proficiency values.
function renderSkills() {
  const skillGrid = document.getElementById('skills-grid');
  skillGrid.innerHTML = skills.map((group) => `
    <article class="panel skill-card tilt-card reveal">
      <p class="panel-kicker">${escapeHtml(group.number)} / Skillset</p>
      <h3>${escapeHtml(group.category)}</h3>
      <div class="skill-items">
        ${group.items.map((item) => `
          <div class="skill-item" data-skill-level="${item.level}">
            <div class="skill-item-heading"><span>${escapeHtml(item.name)}</span><strong>${item.level}%</strong></div>
            <span class="skill-track"><span class="skill-fill"></span></span>
          </div>
        `).join('')}
      </div>
      <span class="panel-glow" aria-hidden="true"></span>
    </article>
  `).join('');
}

// Create project rows and preserve each live link when the original has one.
function renderProjects() {
  const projectList = document.getElementById('project-list');
  projectList.innerHTML = projects.map((project) => {
    const tags = project.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join('');
    const details = `<span class="project-number">${escapeHtml(project.id)}</span>
      <span class="project-main"><span class="project-title">${escapeHtml(project.title)}</span>
      <span class="project-description">${escapeHtml(project.description)}</span>
      <span class="project-tags">${tags}</span></span>
      <span class="project-arrow" aria-hidden="true">↗</span>`;

    if (project.link) {
      return `<a class="project-row reveal" href="${escapeHtml(project.link)}" target="_blank" rel="noopener noreferrer" data-project-id="${escapeHtml(project.id)}">${details}<span class="sr-only">Opens in a new tab</span></a>`;
    }

    return `<article class="project-row project-row-static reveal" data-project-id="${escapeHtml(project.id)}">${details}</article>`;
  }).join('');
}

// Render the study and internship history as a connected timeline.
function renderExperience() {
  const experienceList = document.getElementById('experience-list');
  experienceList.innerHTML = experience.map((item, index) => `
    <article class="timeline-item reveal">
      <span class="timeline-dot" aria-hidden="true"></span>
      <div class="panel timeline-card tilt-card">
        <p class="panel-kicker">${escapeHtml(item.company)} <span>· ${escapeHtml(item.period)}</span></p>
        <h3>${escapeHtml(item.role)}</h3>
        <p>${escapeHtml(item.description)}</p>
      </div>
      <span class="timeline-index">${String(index + 1).padStart(2, '0')}</span>
    </article>
  `).join('');
}

// Add certificate cards to a native, touch-friendly horizontal scroll rail.
function renderCertificates() {
  const rail = document.getElementById('certificate-rail');
  rail.innerHTML = certificates.map((certificate, index) => `
    <article class="panel certificate-card tilt-card reveal">
      <div class="certificate-image"><img src="${IMAGE_PATH}${escapeHtml(certificate.image)}" alt="${escapeHtml(certificate.title)} certificate" loading="lazy" decoding="async"></div>
      <p class="panel-kicker">${String(index + 1).padStart(2, '0')} / ${escapeHtml(certificate.issuer)}</p>
      <h3>${escapeHtml(certificate.title)}</h3>
      <p>${escapeHtml(certificate.description)}</p>
    </article>
  `).join('');
}

// Build accessible text links for the social accounts from the saved profile.
function renderSocialLinks() {
  const socialLinks = document.getElementById('social-links');
  socialLinks.innerHTML = portfolio.socials.map((social) => `
    <a class="social-link magnetic" href="${escapeHtml(social.url)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(social.label)}">
      <span aria-hidden="true">${escapeHtml(social.mark)}</span><span>${escapeHtml(social.label)}</span>
    </a>
  `).join('');
}

// Render the content groups once the page structure is ready.
function renderPortfolio() {
  renderProfile();
  renderMarqueeRow('marquee-forward', technologies);
  renderMarqueeRow('marquee-backward', technologies);
  renderSkills();
  renderProjects();
  renderExperience();
  renderCertificates();
  renderSocialLinks();
}

export { renderPortfolio };
