import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

// Keep original function for backward compatibility
export const getCollectionByName = async (name: string) => {
  let posts = await getCollection(name);
  if (posts && posts.length > 0) {
    return posts.filter(({ data }) => {
      return import.meta.env.PROD ? !data.draft : true;
    });
  } else {
    return [];
  }
};

// Add new function to get pages by type
export const getPagesByType = async (type: 'blog' | 'calculator') => {
  if (type === 'calculator') {
    try {
      const pages = await import.meta.glob('/src/pages/calculators/*.astro');
      const loadedPages = await Promise.all(
        Object.entries(pages).map(async ([path, loader]) => {
          const page = await loader();
          return {
            ...page,
            data: page.frontmatter,
            slug: path.split('/').pop()?.replace('.astro', ''),
            // Filter out draft pages in production
            draft: page.frontmatter.draft || false
          };
        })
      );
      
      // Apply same draft logic as blog posts
      return loadedPages.filter((page) => {
        return import.meta.env.PROD ? !page.draft : true;
      });
    } catch (error) {
      console.error('Error loading calculator pages:', error);
      return [];
    }
  }
  
  // Return blog posts using existing function
  return getCollectionByName('blog');
};

// Utility function to get all content (both blogs and calculators)
export const getAllContent = async () => {
  const [blogs, calculators] = await Promise.all([
    getPagesByType('blog'),
    getPagesByType('calculator')
  ]);
  
  return [...blogs, ...calculators];
};
