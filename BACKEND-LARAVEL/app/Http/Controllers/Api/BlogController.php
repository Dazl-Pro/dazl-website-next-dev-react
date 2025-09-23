<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Blog;
use App\Models\BlogCategory;

class BlogController extends Controller
{
    /**
     * Get all published blog posts
     */
    public function index(Request $request)
    {
        try {
            $query = Blog::with(['category', 'author'])
                        ->where('status', 'published');

            // Filter by category
            if ($request->has('category_id')) {
                $query->where('blog_category_id', $request->category_id);
            }

            // Filter by category slug
            if ($request->has('category')) {
                $query->whereHas('category', function ($q) use ($request) {
                    $q->where('slug', $request->category);
                });
            }

            // Search in title and content
            if ($request->has('search')) {
                $query->where(function ($q) use ($request) {
                    $q->where('title', 'like', '%' . $request->search . '%')
                      ->orWhere('excerpt', 'like', '%' . $request->search . '%')
                      ->orWhere('content', 'like', '%' . $request->search . '%');
                });
            }

            // Filter by featured
            if ($request->has('featured')) {
                $query->where('is_featured', $request->boolean('featured'));
            }

            $blogs = $query->orderBy('published_at', 'desc')
                          ->orderBy('created_at', 'desc')
                          ->paginate(12);

            return response()->json([
                'success' => true,
                'data' => $blogs->items(),
                'pagination' => [
                    'current_page' => $blogs->currentPage(),
                    'total_pages' => $blogs->lastPage(),
                    'total_items' => $blogs->total(),
                    'per_page' => $blogs->perPage()
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve blog posts',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get blog post by slug
     */
    public function show($slug)
    {
        try {
            $blog = Blog::with(['category', 'author'])
                       ->where('slug', $slug)
                       ->where('status', 'published')
                       ->first();

            if (!$blog) {
                return response()->json([
                    'success' => false,
                    'message' => 'Blog post not found'
                ], 404);
            }

            // Increment view count
            $blog->increment('views_count');

            // Get related posts
            $relatedPosts = Blog::with(['category'])
                              ->where('blog_category_id', $blog->blog_category_id)
                              ->where('id', '!=', $blog->id)
                              ->where('status', 'published')
                              ->orderBy('published_at', 'desc')
                              ->limit(3)
                              ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'blog' => $blog,
                    'related_posts' => $relatedPosts
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve blog post',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get featured blog posts
     */
    public function featured()
    {
        try {
            $featuredBlogs = Blog::with(['category', 'author'])
                               ->where('status', 'published')
                               ->where('is_featured', true)
                               ->orderBy('published_at', 'desc')
                               ->limit(6)
                               ->get();

            return response()->json([
                'success' => true,
                'data' => $featuredBlogs
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve featured blog posts',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get latest blog posts
     */
    public function latest($limit = 5)
    {
        try {
            $latestBlogs = Blog::with(['category', 'author'])
                             ->where('status', 'published')
                             ->orderBy('published_at', 'desc')
                             ->limit($limit)
                             ->get();

            return response()->json([
                'success' => true,
                'data' => $latestBlogs
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve latest blog posts',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get popular blog posts (by views)
     */
    public function popular($limit = 5)
    {
        try {
            $popularBlogs = Blog::with(['category', 'author'])
                              ->where('status', 'published')
                              ->orderBy('views_count', 'desc')
                              ->orderBy('published_at', 'desc')
                              ->limit($limit)
                              ->get();

            return response()->json([
                'success' => true,
                'data' => $popularBlogs
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve popular blog posts',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get blog posts by category
     */
    public function getByCategory($categorySlug)
    {
        try {
            $category = BlogCategory::where('slug', $categorySlug)->first();

            if (!$category) {
                return response()->json([
                    'success' => false,
                    'message' => 'Category not found'
                ], 404);
            }

            $blogs = Blog::with(['category', 'author'])
                        ->where('blog_category_id', $category->id)
                        ->where('status', 'published')
                        ->orderBy('published_at', 'desc')
                        ->paginate(12);

            return response()->json([
                'success' => true,
                'data' => [
                    'category' => $category,
                    'blogs' => $blogs->items(),
                    'pagination' => [
                        'current_page' => $blogs->currentPage(),
                        'total_pages' => $blogs->lastPage(),
                        'total_items' => $blogs->total(),
                        'per_page' => $blogs->perPage()
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve blog posts for category',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Search blog posts
     */
    public function search(Request $request)
    {
        $request->validate([
            'query' => 'required|string|min:2',
            'category_id' => 'nullable|exists:blog_categories,id'
        ]);

        try {
            $query = Blog::with(['category', 'author'])
                        ->where('status', 'published')
                        ->where(function ($q) use ($request) {
                            $q->where('title', 'like', '%' . $request->query . '%')
                              ->orWhere('excerpt', 'like', '%' . $request->query . '%')
                              ->orWhere('content', 'like', '%' . $request->query . '%')
                              ->orWhere('meta_keywords', 'like', '%' . $request->query . '%');
                        });

            if ($request->category_id) {
                $query->where('blog_category_id', $request->category_id);
            }

            $blogs = $query->orderBy('published_at', 'desc')->paginate(12);

            return response()->json([
                'success' => true,
                'data' => [
                    'query' => $request->query,
                    'results' => $blogs->items(),
                    'pagination' => [
                        'current_page' => $blogs->currentPage(),
                        'total_pages' => $blogs->lastPage(),
                        'total_items' => $blogs->total(),
                        'per_page' => $blogs->perPage()
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to search blog posts',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get blog archive (by month/year)
     */
    public function archive()
    {
        try {
            $archive = Blog::selectRaw('YEAR(published_at) as year, MONTH(published_at) as month, COUNT(*) as count')
                          ->where('status', 'published')
                          ->whereNotNull('published_at')
                          ->groupBy('year', 'month')
                          ->orderBy('year', 'desc')
                          ->orderBy('month', 'desc')
                          ->get()
                          ->map(function ($item) {
                              return [
                                  'year' => $item->year,
                                  'month' => $item->month,
                                  'month_name' => date('F', mktime(0, 0, 0, $item->month, 1)),
                                  'count' => $item->count,
                                  'url_params' => [
                                      'year' => $item->year,
                                      'month' => str_pad($item->month, 2, '0', STR_PAD_LEFT)
                                  ]
                              ];
                          });

            return response()->json([
                'success' => true,
                'data' => $archive
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve blog archive',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get blog statistics
     */
    public function statistics()
    {
        try {
            $stats = [
                'total_posts' => Blog::count(),
                'published_posts' => Blog::where('status', 'published')->count(),
                'draft_posts' => Blog::where('status', 'draft')->count(),
                'featured_posts' => Blog::where('is_featured', true)->count(),
                'total_views' => Blog::sum('views_count'),
                'posts_by_category' => BlogCategory::withCount('blogs')->get(),
                'monthly_posts' => Blog::selectRaw('YEAR(created_at) as year, MONTH(created_at) as month, COUNT(*) as count')
                                     ->where('status', 'published')
                                     ->groupBy('year', 'month')
                                     ->orderBy('year', 'desc')
                                     ->orderBy('month', 'desc')
                                     ->limit(12)
                                     ->get()
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve blog statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
