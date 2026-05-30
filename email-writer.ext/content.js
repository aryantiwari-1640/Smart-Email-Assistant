const API_URL = '';

const TONES = [
  { id: 'professional', label: 'Professional', icon: '💼' },
  { id: 'friendly',     label: 'Friendly',     icon: '😊' },
  { id: 'concise',      label: 'Concise',       icon: '⚡' },
  { id: 'formal',       label: 'Formal',        icon: '🎩' },
  { id: 'empathetic',   label: 'Empathetic',    icon: '🤝' },
  { id: 'assertive',    label: 'Assertive',     icon: '🎯' },
];

let selectedTone = TONES[0];


function getEmailContent() {
  const selectors = [
    '.h7',
    '.a3s.aiL',
    '.gmail_quote',
    '[role="presentation"]',
  ];
  for (const selector of selectors) {
    const el = document.querySelector(selector);
    if (el) return el.innerText.trim();
  }
  return '';
}

function findComposeToolbar() {
  const selectors = ['.btC', '.aDh', '[role="toolbar"]', '.gU.Up'];
  for (const selector of selectors) {
    const el = document.querySelector(selector);
    if (el) return el;
  }
  return null;
}

function createAIButton() {
  const wrapper = document.createElement('div');
  wrapper.className = 'ai-reply-wrapper';
  wrapper.setAttribute('aria-label', 'AI Reply');

  const mainBtn = document.createElement('button');
  mainBtn.className = 'ai-reply-main';
  mainBtn.setAttribute('type', 'button');
  mainBtn.setAttribute('data-tooltip', 'Generate AI Reply');
  mainBtn.innerHTML = `<em class="ai-reply-icon">✦</em> AI Reply`;

  const divider = document.createElement('div');
  divider.className = 'ai-reply-divider';
  divider.setAttribute('aria-hidden', 'true');

  const chevron = document.createElement('button');
  chevron.className = 'ai-reply-chevron';
  chevron.setAttribute('type', 'button');
  chevron.setAttribute('aria-haspopup', 'true');
  chevron.setAttribute('aria-expanded', 'false');
  chevron.setAttribute('aria-label', 'Select reply tone');
  chevron.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none"
         xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor" stroke-width="2.2"
            stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;

  const dropdown = document.createElement('div');
  dropdown.className = 'ai-reply-dropdown';
  dropdown.setAttribute('role', 'menu');

  const menuLabel = document.createElement('div');
  menuLabel.className = 'ai-reply-menu-label';
  menuLabel.textContent = 'Reply Tone';
  dropdown.appendChild(menuLabel);

  function openDropdown() {
    dropdown.classList.add('open');
    chevron.classList.add('open');
    chevron.setAttribute('aria-expanded', 'true');
  }
  function closeDropdown() {
    dropdown.classList.remove('open');
    chevron.classList.remove('open');
    chevron.setAttribute('aria-expanded', 'false');
  }
  function isOpen() {
    return dropdown.classList.contains('open');
  }

  function renderMenuItems() {
    dropdown.querySelectorAll('.ai-reply-menu-item').forEach(el => el.remove());

    TONES.forEach(tone => {
      const item = document.createElement('button');
      item.className = 'ai-reply-menu-item' + (tone.id === selectedTone.id ? ' selected' : '');
      item.setAttribute('role', 'menuitemradio');
      item.setAttribute('aria-checked', tone.id === selectedTone.id ? 'true' : 'false');
      item.innerHTML = `
        <span class="ai-reply-tone-icon" aria-hidden="true">${tone.icon}</span>
        ${tone.label}
        ${tone.id === selectedTone.id
          ? '<span class="ai-reply-check" aria-hidden="true">✓</span>'
          : ''}
      `;
      item.addEventListener('click', () => {
        selectedTone = tone;
        renderMenuItems();
        closeDropdown();
      });
      dropdown.appendChild(item);
    });
  }

  renderMenuItems();

  chevron.addEventListener('click', (e) => {
    e.stopPropagation();
    isOpen() ? closeDropdown() : openDropdown();
  });


  document.addEventListener('click', (e) => {
    if (!wrapper.contains(e.target)) closeDropdown();
  });


  mainBtn.addEventListener('click', () => {
    closeDropdown();
    handleReplyGeneration({
      tone: selectedTone,
      emailContent: getEmailContent(),
      mainBtn,
      chevron,
    });
  });

  wrapper.appendChild(mainBtn);
  wrapper.appendChild(divider);
  wrapper.appendChild(chevron);
  wrapper.appendChild(dropdown);

  return wrapper;
}


async function handleReplyGeneration({ tone, emailContent, mainBtn, chevron }) {
  const originalHTML = mainBtn.innerHTML;

  mainBtn.innerHTML  = '<em class="ai-reply-icon">⏳</em> Generating…';
  mainBtn.disabled   = true;
  if (chevron) chevron.disabled = true;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emailContent,
        tone: tone.id,
        toneLabel: tone.label,
      }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => response.statusText);
      throw new Error(`API error ${response.status}: ${errText}`);
    }

    const generatedReply = await response.text();
    insertReplyIntoCompose(generatedReply);

    mainBtn.innerHTML = originalHTML;
    mainBtn.disabled  = false;
    if (chevron) chevron.disabled = false;

  } catch (error) {
    console.error('[AI Reply] Generation failed:', error.message);
    showErrorState(mainBtn, chevron, originalHTML);
  }
}

function insertReplyIntoCompose(text) {
  const composeBox = document.querySelector(
    '[role="textbox"][g_editable="true"]'
  );

  if (!composeBox) {
    console.warn('[AI Reply] Compose box not found.');
    return;
  }

  composeBox.focus();

  const inserted = document.execCommand('insertText', false, text);
  if (!inserted) {
    const range = window.getSelection()?.getRangeAt(0);
    if (range) {
      range.deleteContents();
      range.insertNode(document.createTextNode(text));
      range.collapse(false);
    } else {
      composeBox.innerText += text;
    }
  }
}

function showErrorState(mainBtn, chevron, originalHTML) {
  mainBtn.innerHTML = '<em class="ai-reply-icon">❌</em> Failed';
  mainBtn.classList.add('error');
  mainBtn.disabled = true;

  setTimeout(() => {
    mainBtn.innerHTML = originalHTML;
    mainBtn.classList.remove('error');
    mainBtn.disabled  = false;
    if (chevron) chevron.disabled = false;
  }, 2500);
}


function injectButton() {
  document.querySelector('.ai-reply-wrapper')?.remove();

  const toolbar = findComposeToolbar();
  if (!toolbar) {
    console.warn('[AI Reply] Toolbar not found.');
    return;
  }

  console.log('[AI Reply] Toolbar found. Injecting button…');
  const buttonWrapper = createAIButton();
  toolbar.insertBefore(buttonWrapper, toolbar.firstChild);
}

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    const addedNodes = Array.from(mutation.addedNodes);

    const hasComposeElements = addedNodes.some(node =>
      node.nodeType === Node.ELEMENT_NODE &&
      (
        node.matches('.aDh, .btC, [role="dialog"]') ||
        node.querySelector('.aDh, .btC, [role="dialog"]')
      )
    );

    if (hasComposeElements) {
      console.log('[AI Reply] Compose window detected.');
      setTimeout(injectButton, 500);
    }
  }
});

observer.observe(document.body, { childList: true, subtree: true });