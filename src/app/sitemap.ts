import dbConnect from '@/lib/dbConnect';
import BlogPost from '@/models/BlogPost';
import Project from '@/models/Project';
import { type PublishedBlogPostDisplay } from '@/types/blogpost';
import { type ProjectDisplay } from '@/types/project';
import { type HydratedDocument } from 'mongoose';
import type { MetadataRoute } from 'next'


async function fetchAllProjects() {
    await dbConnect();
    const projects = await Project.find<HydratedDocument<ProjectDisplay>>()
  
    const serialisedProjects = projects.map((project) => project.toJSON())
    return serialisedProjects
  }
  
async function fetchAllBlogPosts() {
    await dbConnect();
    const posts = await BlogPost.find<HydratedDocument<PublishedBlogPostDisplay>>({
        status: "PUBLISHED",
    })


    const serialisedPosts = posts.map((post) => post.toJSON())
    return serialisedPosts;

}
 
export default async function sitemap() {
    const currentUrl = process.env.NEXT_PUBLIC_URL

    const blogPosts = await fetchAllBlogPosts()
    const projects = await fetchAllProjects()

    const mainPages: MetadataRoute.Sitemap = [
        {
            url: `${currentUrl}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1,
        },
        {
            url: `${currentUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${currentUrl}/projects`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${currentUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
    ]

    const projectPages: MetadataRoute.Sitemap =  projects.map(project => {
        return {
            url: `${currentUrl}/projects/${project.slug}`,
            lastModified: project.updatedAt,
            priority: 0.7
        }
    })

    const blogPostPages: MetadataRoute.Sitemap = blogPosts.map(post => {
        return {
            url: `${currentUrl}/blog/${post.slug}`,
            lastModified: post.updatedAt,
            priority: 0.6
        }
    })

    return [...mainPages,...projectPages, ...blogPostPages]
}