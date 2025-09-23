<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;

class LogApiRequestsMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $startTime = microtime(true);

        // Log the incoming request
        $this->logRequest($request);

        $response = $next($request);

        // Log the response
        $this->logResponse($request, $response, $startTime);

        return $response;
    }

    /**
     * Log the incoming request
     */
    private function logRequest(Request $request): void
    {
        $logData = [
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'user_id' => auth()->id(),
            'user_type' => auth()->check() ? class_basename(auth()->user()) : null,
            'headers' => $this->filterHeaders($request->headers->all()),
            'query_params' => $request->query(),
            'body_size' => strlen($request->getContent()),
            'timestamp' => now()->toISOString(),
        ];

        // Don't log sensitive data
        if (!$this->shouldLogBody($request)) {
            $logData['body'] = '[FILTERED]';
        } else {
            $logData['body'] = $request->except(['password', 'password_confirmation', 'token']);
        }

        Log::channel('api')->info('API Request', $logData);
    }

    /**
     * Log the response
     */
    private function logResponse(Request $request, Response $response, float $startTime): void
    {
        $duration = round((microtime(true) - $startTime) * 1000, 2); // Duration in milliseconds

        $logData = [
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'status_code' => $response->getStatusCode(),
            'duration_ms' => $duration,
            'response_size' => strlen($response->getContent()),
            'user_id' => auth()->id(),
            'user_type' => auth()->check() ? class_basename(auth()->user()) : null,
            'timestamp' => now()->toISOString(),
        ];

        // Log response content for errors or if specifically configured
        if ($response->getStatusCode() >= 400 || config('logging.api.log_response_body', false)) {
            $content = $response->getContent();
            $logData['response_body'] = json_decode($content, true) ?? $content;
        }

        $level = $response->getStatusCode() >= 400 ? 'error' : 'info';
        Log::channel('api')->{$level}('API Response', $logData);
    }

    /**
     * Filter sensitive headers
     */
    private function filterHeaders(array $headers): array
    {
        $sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];

        return array_filter($headers, function ($key) use ($sensitiveHeaders) {
            return !in_array(strtolower($key), $sensitiveHeaders);
        }, ARRAY_FILTER_USE_KEY);
    }

    /**
     * Determine if request body should be logged
     */
    private function shouldLogBody(Request $request): bool
    {
        // Don't log file uploads or login requests
        $sensitiveRoutes = ['login', 'register', 'password'];

        foreach ($sensitiveRoutes as $route) {
            if (str_contains($request->path(), $route)) {
                return false;
            }
        }

        // Don't log if request contains files
        if ($request->hasFile('*')) {
            return false;
        }

        return true;
    }
}