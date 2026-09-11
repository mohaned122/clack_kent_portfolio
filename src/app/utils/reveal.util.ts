export function revealAnimated(selector: string, staggerMs = 50): void {
  setTimeout(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>(`${selector}:not(.ftco-animated)`)
    );
    nodes.forEach((node, index) => {
      setTimeout(() => node.classList.add('fadeInUp', 'ftco-animated'), index * staggerMs);
    });
  }, 0);
}