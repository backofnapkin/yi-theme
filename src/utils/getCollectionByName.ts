import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

// Keep original function for backward compatibility
export const getCollectionByName = async (name: string) => {
  if (name === 'all') {
    return getAllContent();
  }
  
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
      console.log('Looking for calculator pages...');
      const pages = await import.meta.glob('/src/pages/**/*.astro');
      console.log('Found .astro pages:', Object.keys(pages));
      
      const loadedPages = await Promise.all(
        Object.entries(pages).map(async ([path, loader]) => {
          const page = await loader();
          console.log('Loading page:', {
            path,
            frontmatter: page.frontmatter,
            category: page.frontmatter?.category
          });
          
          // Only include pages that have frontmatter with a category
          if (!page.frontmatter?.category) {
            console.log('No category found for:', path);
            return null;
          }
          
          const processedPage = {
            ...page,
            data: {
              ...page.frontmatter,
              // Ensure date is a Date object
              date: page.frontmatter.date ? new Date(page.frontmatter.date) : new Date(),
              // Convert category to array if it's a string
              category: Array.isArray(page.frontmatter.category) 
                ? page.frontmatter.category 
                : [page.frontmatter.category]
            },
            slug: path.split('/').pop()?.replace('.astro', ''),
            id: path,
            collection: 'astro-pages',
            // Filter out draft pages in production
            draft: page.frontmatter.draft || false
          };

          console.log('Processed page:', {
            path,
            category: processedPage.data.category,
            collection: processedPage.collection
          });

          return processedPage;
        })
      );
      
      // Filter out null values and apply draft logic
      const filteredPages = loadedPages
        .filter((page): page is NonNullable<typeof page> => 
          page !== null && (import.meta.env.PROD ? !page.draft : true)
        );
      
      console.log('Final filtered calculator pages:', filteredPages.map(page => ({
        path: page.id,
        category: page.data.category,
        collection: page.collection
      })));

      return filteredPages;
    } catch (error) {
      console.error('Error loading calculator pages:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      return [];
    }
  }
  
  // Return blog posts using existing function
  return getCollectionByName('blog');
};

// Utility function to get all content (both blogs and calculators)
export const getAllContent = async () => {
  console.log('Getting all content...');
  const [blogs, calculators] = await Promise.all([
    getPagesByType('blog'),
    getPagesByType('calculator')
  ]);
  
  const allContent = [...blogs, ...calculators];
  console.log('All content assembled:', allContent.map(content => ({
    title: content.data.title,
    category: content.data.category,
    collection: content.collection,
    path: content.id || content.slug
  })));
  
  return allContent;
};
