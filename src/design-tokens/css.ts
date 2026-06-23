import { semantic } from "./semantic";

export function injectCSSVariables() {
    const root = document.documentElement;

    const vars = {
        "--color-primary": semantic.color.primary,
        "--color-success": semantic.color.success,
        "--color-warning": semantic.color.warning,
        "--color-error": semantic.color.error,

        "--text-primary": semantic.color.text.primary,
        "--text-secondary": semantic.color.text.secondary,

        "--bg-page": semantic.color.background.page,
        "--bg-card": semantic.color.background.card,

        "--radius-card": `${semantic.radius.card}px`,
        "--radius-pill": `${semantic.radius.pill}px`,

        "--shadow-md": semantic.shadow.md,
        "--blur-glass": semantic.blur.glass,
    };

    for (const [key, value] of Object.entries(vars)) {
        root.style.setProperty(key, value);
    }
}