const menuIcon = document.querySelector('#menu-icon');
const navLinks = document.querySelector('.nav-links');

menuIcon.onclick = () => {
    navLinks.classList.toggle('active');
}

'use strict';

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];


function initMenu() {
    const icon = $('#menu-icon');
    const links = $('.nav-links');
    if (!icon || !links) return;

    const setOpen = (open) => {
        links.classList.toggle('active', open);
        icon.setAttribute('aria-expanded', open);
    };
    icon.addEventListener('click', () => setOpen(!links.classList.contains('active')));
    icon.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen(!links.classList.contains('active'));
        }
    });
    document.addEventListener('keydown', (e) => e.key === 'Escape' && setOpen(false));
    $$('a', links).forEach((a) => a.addEventListener('click', () => setOpen(false)));
}


function initGithubButton() {
    const btn = $('#github-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
        window.open(btn.dataset.url, '_blank', 'noopener,noreferrer');
    });
}


function initActiveNav() {
    const sections = $$('section[id]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                $$('.nav-links a').forEach((a) =>
                    a.classList.toggle('current', a.getAttribute('href') === `#${entry.target.id}`));
            }
        });
    }, { threshold: 0.5 });
    sections.forEach((s) => observer.observe(s));
}


const projects = [
    { title: 'Hikayat Putih',      repo: 'https://github.com/Abenis/REPO-NAME' },
    { title: 'StudentFoodCare',    repo: 'https://github.com/Abenis/REPO-NAME' },
    { title: 'Birthday Wish Card', repo: 'https://github.com/Abenis/wish-card'},
    { title: 'Sarawak Heritage Online Auction', repo: 'https://github.com/Abenis/REPO-NAME' },
    { title: 'Eco Mining',         repo: 'https://github.com/Abenis/REPO-NAME' },
];

function initProjectButtons() {
    $$('.project-card').forEach((card, i) => {
        const data = projects[i];
        if (!data) return;
        $$('[data-action]', card).forEach((btn) => {
            const url = data[btn.dataset.action];
            if (!url) { btn.remove(); return; }   // no link, so no button
            btn.href = url;
        });
    });
}

function initContactForm() {
    const form = $('#contact-form');
    const input = $('#email');
    const message = $('#form-message');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
        message.textContent = valid ? 'Thanks! I will get back to you soon.' : 'Please enter a valid email address.';
        message.style.color = valid ? 'green' : 'crimson';
        if (valid) form.reset(); else input.focus();
    });
}


function initTheme() {
    const btn = $('#theme-toggle');
    if (!btn) return;
    try {
        if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark');
    } catch { /* storage blocked, ignore */ }

    btn.addEventListener('click', () => {
        const dark = document.body.classList.toggle('dark');
        try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch {}
    });
}

function initBackToTop() {
    const btn = $('#back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 400));
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}


function initReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
        });
    }, { threshold: 0.15 });
    $$('.grid-card, .project-card, .section-title').forEach((el) => {
        el.classList.add('reveal');
        observer.observe(el);
    });
}


function initHeaderScroll() {
    const header = $('header');
    if (!header) return;
    window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 50));
}


function showToast(text) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = text;
    toast.setAttribute('role', 'status');
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}

document.addEventListener('DOMContentLoaded', () => {
    [initMenu, initGithubButton, initActiveNav, initProjectButtons, initContactForm,
     initTheme, initBackToTop, initReveal, initHeaderScroll].forEach((fn) => {
        try { fn(); } catch (err) { console.warn(`${fn.name} failed:`, err.message); }
    });
});