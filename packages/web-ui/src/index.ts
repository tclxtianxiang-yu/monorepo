type Variant = "primary" | "ghost" | "outline";

type ButtonOptions = {
  label: string;
  variant?: Variant;
  onClick?: (event: MouseEvent) => void;
};

type InputOptions = {
  placeholder?: string;
  value?: string;
  type?: "text" | "email" | "password" | "search";
  onInput?: (event: Event) => void;
  onChange?: (event: Event) => void;
};

type CardOptions = {
  title?: string;
  subtitle?: string;
  body?: string;
  footer?: string;
};

const STYLE_ID = "monorepo-web-ui-styles";

const STYLES = `
:root {
  --web-ui-bg: #f8f5ef;
  --web-ui-ink: #222222;
  --web-ui-ink-muted: #5c5c5c;
  --web-ui-accent: #1b7f5c;
  --web-ui-accent-strong: #136246;
  --web-ui-surface: #ffffff;
  --web-ui-border: #d6cfc2;
  --web-ui-shadow: 0 6px 18px rgba(17, 17, 17, 0.12);
  --web-ui-radius: 12px;
}

.web-ui-button,
.web-ui-input {
  font-family: "Space Grotesk", "Segoe UI", sans-serif;
  font-size: 14px;
  letter-spacing: 0.02em;
  border-radius: var(--web-ui-radius);
  border: 1px solid var(--web-ui-border);
  transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
}

.web-ui-card {
  font-family: "Space Grotesk", "Segoe UI", sans-serif;
  background: var(--web-ui-surface);
  color: var(--web-ui-ink);
  border-radius: 18px;
  border: 1px solid var(--web-ui-border);
  box-shadow: var(--web-ui-shadow);
  padding: 20px;
  display: grid;
  gap: 16px;
  min-width: 280px;
}

.web-ui-card__title {
  margin: 0;
  font-size: 20px;
  letter-spacing: 0.02em;
}

.web-ui-card__subtitle {
  margin: 4px 0 0;
  color: var(--web-ui-ink-muted);
  font-size: 13px;
}

.web-ui-card__body {
  display: grid;
  gap: 12px;
}

.web-ui-card__footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  align-items: center;
}

.web-ui-button {
  padding: 10px 18px;
  cursor: pointer;
  background: var(--web-ui-accent);
  color: #ffffff;
  box-shadow: var(--web-ui-shadow);
}

.web-ui-button:hover {
  transform: translateY(-1px);
  border-color: var(--web-ui-accent-strong);
}

.web-ui-button:active {
  transform: translateY(0);
}

.web-ui-button--ghost {
  background: transparent;
  color: var(--web-ui-accent-strong);
  box-shadow: none;
}

.web-ui-button--outline {
  background: var(--web-ui-surface);
  color: var(--web-ui-ink);
  box-shadow: none;
}

.web-ui-input {
  padding: 10px 14px;
  background: var(--web-ui-surface);
  color: var(--web-ui-ink);
  box-shadow: none;
}

.web-ui-input::placeholder {
  color: var(--web-ui-ink-muted);
}

.web-ui-input:focus {
  outline: none;
  border-color: var(--web-ui-accent);
  box-shadow: 0 0 0 3px rgba(27, 127, 92, 0.15);
}
`;

function ensureStyles(): void {
  if (document.getElementById(STYLE_ID)) {
    return;
  }

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = STYLES;
  document.head.appendChild(style);
}

export function createButton(options: ButtonOptions): HTMLButtonElement {
  ensureStyles();

  const button = document.createElement("button");
  button.type = "button";
  button.className = "web-ui-button";
  button.textContent = options.label;

  const variant = options.variant ?? "primary";
  if (variant !== "primary") {
    button.classList.add(`web-ui-button--${variant}`);
  }

  if (options.onClick) {
    button.addEventListener("click", options.onClick);
  }

  return button;
}

export function createInput(options: InputOptions = {}): HTMLInputElement {
  ensureStyles();

  const input = document.createElement("input");
  input.className = "web-ui-input";
  input.type = options.type ?? "text";

  if (options.placeholder) {
    input.placeholder = options.placeholder;
  }

  if (typeof options.value === "string") {
    input.value = options.value;
  }

  if (options.onInput) {
    input.addEventListener("input", options.onInput);
  }

  if (options.onChange) {
    input.addEventListener("change", options.onChange);
  }

  return input;
}

export function createCard(options: CardOptions = {}): HTMLDivElement {
  ensureStyles();

  const card = document.createElement("div");
  card.className = "web-ui-card";

  if (options.title || options.subtitle) {
    const header = document.createElement("header");
    if (options.title) {
      const title = document.createElement("h2");
      title.className = "web-ui-card__title";
      title.textContent = options.title;
      header.appendChild(title);
    }

    if (options.subtitle) {
      const subtitle = document.createElement("p");
      subtitle.className = "web-ui-card__subtitle";
      subtitle.textContent = options.subtitle;
      header.appendChild(subtitle);
    }

    card.appendChild(header);
  }

  const body = document.createElement("div");
  body.className = "web-ui-card__body";
  if (options.body) {
    const bodyText = document.createElement("p");
    bodyText.textContent = options.body;
    body.appendChild(bodyText);
  }
  card.appendChild(body);

  if (options.footer) {
    const footer = document.createElement("footer");
    footer.className = "web-ui-card__footer";
    footer.textContent = options.footer;
    card.appendChild(footer);
  }

  return card;
}

export type { ButtonOptions, CardOptions, InputOptions, Variant };
