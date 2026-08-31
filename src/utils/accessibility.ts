/**
 * ARIA and accessibility utility helpers.
 *
 * Provides reusable functions for:
 * - Setting standard ARIA attributes on elements
 * - Creating accessible live regions for dynamic content
 * - Managing focus for keyboard navigation
 * - Generating screen-reader-friendly descriptions
 *
 * All interactive elements in the toolkit use these helpers
 * to maintain WCAG AA compliance.
 */

/**
 * Set an aria-label on an element.
 */
export function setAriaLabel(element: HTMLElement, label: string): void {
  element.setAttribute('aria-label', label);
}

/**
 * Set an aria-live region attribute.
 * @param politeness - 'polite' for non-urgent updates, 'assertive' for immediate
 */
export function setAriaLive(
  element: HTMLElement,
  politeness: 'polite' | 'assertive' = 'polite'
): void {
  element.setAttribute('aria-live', politeness);
}

/**
 * Create an accessible live region element for dynamic announcements.
 * Content updates to this element will be announced by screen readers.
 */
export function createLiveRegion(
  politeness: 'polite' | 'assertive' = 'polite',
  role: 'status' | 'alert' | 'log' = 'status'
): HTMLElement {
  const region = document.createElement('div');
  region.setAttribute('aria-live', politeness);
  region.setAttribute('role', role);
  region.classList.add('sr-live-region');
  return region;
}

/**
 * Create a visually hidden element that is still accessible to screen readers.
 * Useful for providing additional context without visual clutter.
 */
export function createVisuallyHidden(text: string): HTMLElement {
  const span = document.createElement('span');
  span.classList.add('visually-hidden');
  span.textContent = text;
  // Inline styles as fallback if CSS class is not loaded
  span.style.position = 'absolute';
  span.style.width = '1px';
  span.style.height = '1px';
  span.style.padding = '0';
  span.style.margin = '-1px';
  span.style.overflow = 'hidden';
  span.style.clip = 'rect(0, 0, 0, 0)';
  span.style.whiteSpace = 'nowrap';
  span.style.border = '0';
  return span;
}

/**
 * Set up keyboard navigation for a group of focusable elements.
 * Implements arrow key navigation within the group.
 */
export function setupKeyboardNav(
  container: HTMLElement,
  selector: string
): void {
  container.addEventListener('keydown', (event: KeyboardEvent) => {
    const items = Array.from(
      container.querySelectorAll<HTMLElement>(selector)
    );
    const currentIndex = items.indexOf(document.activeElement as HTMLElement);

    if (currentIndex === -1) return;

    let nextIndex = currentIndex;

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        nextIndex = (currentIndex + 1) % items.length;
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        nextIndex = (currentIndex - 1 + items.length) % items.length;
        break;
      case 'Home':
        event.preventDefault();
        nextIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        nextIndex = items.length - 1;
        break;
      default:
        return;
    }

    items[nextIndex]?.focus();
  });
}

/**
 * Announce a message to screen readers via an injected live region.
 * The message is temporarily inserted and then removed after announcement.
 */
export function announce(
  message: string,
  politeness: 'polite' | 'assertive' = 'polite'
): void {
  const region = document.createElement('div');
  region.setAttribute('aria-live', politeness);
  region.setAttribute('role', politeness === 'assertive' ? 'alert' : 'status');
  region.style.position = 'absolute';
  region.style.width = '1px';
  region.style.height = '1px';
  region.style.overflow = 'hidden';
  region.style.clip = 'rect(0, 0, 0, 0)';
  document.body.appendChild(region);

  // Small delay ensures the live region is registered before content is set
  requestAnimationFrame(() => {
    region.textContent = message;
    // Remove after screen reader has time to announce
    setTimeout(() => {
      document.body.removeChild(region);
    }, 1000);
  });
}

/**
 * Make an element describable by linking it to a description element.
 * Creates the description element if descriptionText is provided.
 */
export function setAriaDescription(
  element: HTMLElement,
  descriptionId: string,
  descriptionText?: string
): void {
  element.setAttribute('aria-describedby', descriptionId);

  if (descriptionText) {
    let descEl = document.getElementById(descriptionId);
    if (!descEl) {
      descEl = createVisuallyHidden(descriptionText);
      descEl.id = descriptionId;
      element.parentElement?.appendChild(descEl);
    } else {
      descEl.textContent = descriptionText;
    }
  }
}

/**
 * Set appropriate ARIA attributes for a button that controls
 * another element (e.g., expand/collapse patterns).
 */
export function setAriaControls(
  button: HTMLElement,
  controlledId: string,
  expanded: boolean
): void {
  button.setAttribute('aria-controls', controlledId);
  button.setAttribute('aria-expanded', String(expanded));
}
