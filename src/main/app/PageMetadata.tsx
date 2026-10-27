import { useEffect } from 'react';

const SITE_URL = 'https://www.ethansingh.com';

interface Props {
  title: string;
  description: string;
  path: string;
}

function setMeta(name: string, content: string, property = false) {
  const attribute = property ? 'property' : 'name';
  let element = document.head.querySelector<HTMLMetaElement>(
    `meta[${attribute}="${name}"]`
  );
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.append(element);
  }
  element.content = content;
}

export function PageMetadata({ title, description, path }: Props) {
  useEffect(() => {
    const url = new URL(path, SITE_URL).toString();
    document.title = title;
    setMeta('description', description);
    setMeta('og:type', 'website', true);
    setMeta('og:site_name', 'A Metro Parking App', true);
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:url', url, true);
    setMeta('twitter:card', 'summary');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);

    let canonical = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]'
    );
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.append(canonical);
    }
    canonical.href = url;
  }, [description, path, title]);

  return null;
}
